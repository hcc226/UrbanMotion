/**
 * Wind map code (c) 2012
 * Fernanda Viegas & Martin Wattenberg
 */

 /**
 * Simple representation of 2D vector.
 */

console.log('222222222222222222222')
var Vector = function(x, y) {
	this.x = x;
	this.y = y;
}


Vector.polar = function(r, theta) {
	return new Vector(r * Math.cos(theta), r * Math.sin(theta));
};


Vector.prototype.length = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};


Vector.prototype.copy = function(){
  return new Vector(this.x, this.y);
};


Vector.prototype.setLength = function(length) {
	var current = this.length();
	if (current) {
		var scale = length / current;
		this.x *= scale;
		this.y *= scale;
	}
	return this;
};


Vector.prototype.setAngle = function(theta) {
  var r = length();
  this.x = r * Math.cos(theta);
  this.y = r * Math.sin(theta);
  return this;
};


Vector.prototype.getAngle = function() {
  return Math.atan2(this.y, this.x);
};


Vector.prototype.d = function(v) {
		var dx = v.x - this.x;
		var dy = v.y - this.y;
		return Math.sqrt(dx * dx + dy * dy);
};/**
 * Identity projection.
 */
var IDProjection = {
	project: function(x, y, opt_v) {
		var v = opt_v || new Vector();
		v.x = x;
		v.y = y;
	  return v;
  },
	invert: function(x, y, opt_v) {
		var v = opt_v || new Vector();
		v.x = x;
		v.y = y;
	  return v;
  }
};

/**
 * Albers equal-area projection.
 * Constant param values after d3 (Bostock, Carden).
 */
var Albers = function() {
  function radians(degrees) {
		return Math.PI * degrees / 180;
  }

  var phi1 = radians(29.5);
  var phi2 = radians(45.5);
  var n = .5 * (phi1 + phi2);
	var C = Math.cos(phi1) * Math.cos(phi1) + 2 * n * Math.sin(phi1);
	var phi0 = radians(38);
	var lambda0 = radians(-98);
	var rho0 = Math.sqrt(C - 2 * n * Math.sin(phi0)) / n;

  return {
		project: function(lon, lat, opt_result) {
			lon = radians(lon);
		  lat = radians(lat);
		  var theta = n * (lon - lambda0);
		  var rho = Math.sqrt(C - 2 * n * Math.sin(lat)) / n;
		  var x = rho * Math.sin(theta);
		  var y = rho0 - rho * Math.cos(theta);
			if (opt_result) {
		    opt_result.x = x;
		    opt_result.y = y;
		    return opt_result;
	    }
		  return new Vector(x, y);
		},
		invert: function(x, y) {
			var rho2 = x * x + (rho0 - y) * (rho0 - y);
			var theta = Math.atan(x / (rho0 - y));
			var lon = lambda0 + theta / n;
			var lat = Math.asin((C / n - rho2 * n) / 2);
			return new Vector(lon * 180 / Math.PI, lat * 180 / Math.PI);
		}
	};
}();


var ScaledAlbers = function(scale, offsetX, offsetY, longMin, latMin) {
	this.scale = scale;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.longMin = longMin;
	this.latMin = latMin;
  this.swCorner = Albers.project(longMin, latMin);
};

ScaledAlbers.temp = new Vector(0, 0);

ScaledAlbers.prototype.project = function(lon, lat, opt_result) {
  var proj = Albers.project(lon, lat, ScaledAlbers.temp);
  var a = proj.x;
	var b = proj.y;
	var x = this.scale * (a - this.swCorner.x) + this.offsetX;
	var y = -this.scale * (b - this.swCorner.y) + this.offsetY;
	if (opt_result) {
		opt_result.x = x;
		opt_result.y = y;
		return opt_result;
	}
	return new Vector(x, y);
};

ScaledAlbers.prototype.invert = function(x, y) {
	var a = (x - this.offsetX) / this.scale + this.swCorner.x;
	var b = (y - this.offsetY) / -this.scale + this.swCorner.y;
	return Albers.invert(a, b);
};




/**
 * Listens to mouse events on an element, tracks zooming and panning,
 * informs other components of what's going on.
 */
var Animator = function(element, opt_animFunc, opt_unzoomButton) {
 	this.element = element;
	this.mouseIsDown = false;
	this.mouseX = -1;
	this.mouseY = -1;
	this.animating = true;
	this.state = 'animate';
	this.listeners = [];
	this.dx = 0;
	this.dy = 0;
	this.scale = 1;
	this.zoomProgress = 0;
	this.scaleTarget = 1;
	this.scaleStart = 1;
	this.animFunc = opt_animFunc;
	this.unzoomButton = opt_unzoomButton;
	
	if (element) {
		var self = this;
  	$(element).mousedown(function(e){
			self.mouseX = e.pageX - this.offsetLeft;
	    self.mouseY = e.pageY - this.offsetTop;
  		self.mousedown();
  	});
  	$(element).mouseup(function(e){
			self.mouseX = e.pageX - this.offsetLeft;
	    self.mouseY = e.pageY - this.offsetTop;
  		self.mouseup();
  	});
  	$(element).mousemove(function(e){
			self.mouseX = e.pageX - this.offsetLeft;
	    self.mouseY = e.pageY - this.offsetTop;
  		self.mousemove();
  	});
  }
};
 

Animator.prototype.mousedown = function() {
	this.state = 'mouse-down';
	this.notify('startMove');
	this.landingX = this.mouseX;
	this.landingY = this.mouseY;
	this.dxStart = this.dx;
	this.dyStart = this.dy;
	this.scaleStart = this.scale;
	this.mouseIsDown = true;
};


Animator.prototype.mousemove = function() {
	if (!this.mouseIsDown) {
		this.notify('hover');
		return;
	}
	var ddx = this.mouseX - this.landingX;
	var ddy = this.mouseY - this.landingY;
	var slip = Math.abs(ddx) + Math.abs(ddy);
	if (slip > 2 || this.state == 'pan') {
		this.state = 'pan';
		this.dx += ddx;
		this.dy += ddy;
		this.landingX = this.mouseX;
		this.landingY = this.mouseY;
		this.notify('move');
	}
}

Animator.prototype.mouseup = function() {
	this.mouseIsDown = false;
	if (this.state == 'pan') {
		this.state = 'animate';
		this.notify('endMove');
		return;
	}
	this.zoomClick(this.mouseX, this.mouseY);
};

 
Animator.prototype.add = function(listener) {
 	this.listeners.push(listener);
};


Animator.prototype.notify = function(message) {
	if (this.unzoomButton) {
		var diff = Math.abs(this.scale - 1) > .001 ||
		           Math.abs(this.dx) > .001 || Math.abs(this.dy > .001);
		this.unzoomButton.style.visibility = diff ? 'visible' : 'hidden';
	}
	if (this.animFunc && !this.animFunc()) {
		return;
	}
	for (var i = 0; i < this.listeners.length; i++) {
		var listener = this.listeners[i];
		console.log(this)
		console.log(listener)
        console.log(listener[message])
		if (listener[message]) {
			listener[message].call(listener, this);
		}
	}
};


Animator.prototype.unzoom = function() {
	this.zoom(0, 0, 1);
};


Animator.prototype.zoomClick = function(x, y) {
	var z = 1.7;
	var scale = 1.7 * this.scale;
	var dx = x - z * (x - this.dx);
	var dy = y - z * (y - this.dy);
	this.zoom(dx, dy, scale);
};

Animator.prototype.zoom = function(dx, dy, scale) {
	this.state = 'zoom';
  this.zoomProgress = 0;
  this.scaleStart = this.scale;
	this.scaleTarget = scale;
	this.dxTarget = dx;
	this.dyTarget = dy;
	this.dxStart = this.dx;
	this.dyStart = this.dy;
	this.notify('startMove');
};

Animator.prototype.relativeZoom = function() {
	return this.scale / this.scaleStart;
};


Animator.prototype.relativeDx = function() {
	return this.dx - this.dxStart;
}

Animator.prototype.relativeDy = function() {
	return this.dy - this.dyStart;
}

Animator.prototype.start = function(opt_millis) {
	var millis = opt_millis || 20;
	var self = this;
	function go() {
		var start = new Date();
		self.loop();
		var time = new Date() - start;
		setTimeout(go, 10);
	}
	go();
	//self.loop();
};


Animator.prototype.loop = function() {
    //console.log(this.state);
	if (this.state == 'mouse-down' || this.state == 'pan') {
		return;
	}
	if (this.state == 'animate') {
  	this.notify('animate');
		return;
  }
	if (this.state == 'zoom') {
  	this.zoomProgress = Math.min(1, this.zoomProgress + .07);
	  var u = (1 + Math.cos(Math.PI * this.zoomProgress)) / 2;
		function lerp(a, b) {
			return u * a + (1 - u) * b;
		}
	  this.scale = lerp(this.scaleStart, this.scaleTarget);
		this.dx = lerp(this.dxStart, this.dxTarget);
		this.dy = lerp(this.dyStart, this.dyTarget);
  	if (this.zoomProgress < 1) {
  		this.notify('move');
  	} else {
  		this.state = 'animate';
  		this.zoomCurrent = this.zoomTarget;
   		this.notify('endMove');
  	}
  }
};
 


/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} scale The scale factor for the projection.
 * @param {number} offsetX
 * @param {number} offsetY
 * @param {number} longMin
 * @param {number} latMin
 * @param {VectorField} field
 * @param {number} numParticles
 */
var MotionDisplay = function(canvas, imageCanvas, field, numParticles, opt_projection) {
	this.canvas = canvas;
  this.projection = opt_projection || IDProjection;
  this.field = field;
	this.numParticles = numParticles;
	this.first = true;
	this.maxLength = field.maxLength;
	this.speedScale = 1;
	this.renderState = 'normal';
	this.imageCanvas = imageCanvas;
	this.x0 = this.field.x0;
	this.x1 = this.field.x1;
	this.y0 = this.field.y0;
	this.y1 = this.field.y1;
	this.makeNewParticles(null, true);
	this.colors = [];
	this.rgb = '40, 40, 40';
	this.background = 'rgb(' + this.rgb + ')';
	this.backgroundAlpha = 'rgba(' + this.rgb + ', 0.02)';
	this.outsideColor = '#fff';
	for (var i = 0; i < 256; i++) {
		this.colors[i] = 'rgb(' + i + ',' + i + ',' + i + ')';
	}
	if (this.projection) {
  	this.startOffsetX = this.projection.offsetX;
  	this.startOffsetY = this.projection.offsetY;
  	this.startScale = this.projection.scale;
  }
};


MotionDisplay.prototype.setAlpha = function(alpha) {
	this.backgroundAlpha = 'rgba(' + this.rgb + ', ' + alpha + ')';
};

MotionDisplay.prototype.makeNewParticles = function(animator) {
	this.particles = [];
	for (var i = 0; i < this.numParticles; i++) {
		this.particles.push(this.makeParticle(animator));
	}
};


MotionDisplay.prototype.makeParticle = function(animator) {
	var dx = animator ? animator.dx : 0;
	var dy = animator ? animator.dy : 0;
	var scale = animator ? animator.scale : 1;
	var safecount = 0;
	for (;;) {
		var a = Math.random();
		var b = Math.random();
		//console.log(a)
		//console.log(b)
		var x = a * this.x0 + (1 - a) * this.x1;
		var y = b * this.y0 + (1 - b) * this.y1;
		var v = this.field.getValue(x, y);
		//console.log(v)
		if (this.field.maxLength == 0) {
			return new Particle(x, y, 1 + 40 * Math.random());
		}
		var m = v.length() / this.field.maxLength;
		// The random factor here is designed to ensure that
		// more particles are placed in slower areas; this makes the
		// overall distribution appear more even.
		if ((v.x || v.y) && (++safecount > 10 || Math.random() > m * .9)) {
			var proj = this.projection.project(x, y);
			var sx = proj.x * scale + dx;
			var sy = proj.y * scale + dy;
			if (++safecount > 10 || !(sx < 0 || sy < 0 || sx > this.canvas.width || sy > this.canvas.height)) {
	      return new Particle(x, y, 1 + 40 * Math.random());
      }	
		}
	}
};


MotionDisplay.prototype.startMove = function(animator) {
	// Save screen.
	this.imageCanvas.getContext('2d').drawImage(this.canvas, 0, 0);
};


MotionDisplay.prototype.endMove  = function(animator) {
	if (animator.scale < 1.1) {
		this.x0 = this.field.x0;
		this.x1 = this.field.x1;
		this.y0 = this.field.y0;
		this.y1 = this.field.y1;
	} else {
		// get new bounds for making new particles.
		var p = this.projection;
		var self = this;
		function invert(x, y) {
			x = (x - animator.dx) / animator.scale;
			y = (y - animator.dy) / animator.scale;
			return self.projection.invert(x, y);
		}
		var loc = invert(0, 0);
		var x0 = loc.x;
		var x1 = loc.x;
		var y0 = loc.y;
		var y1 = loc.y;
		function expand(x, y) {
			var v = invert(x, y);
			x0 = Math.min(v.x, x0);
			x1 = Math.max(v.x, x1);
			y0 = Math.min(v.y, y0);
			y1 = Math.max(v.y, y1);
		}
		// This calculation with "top" is designed to fix a bug
		// where we were missing particles at the top of the
		// screen with north winds. This is a short-term fix,
		// it's dependent on the particular projection and
		// region, and we should figure out a more general
		// solution soon.
		var top = -.2 * this.canvas.height;
		expand(top, this.canvas.height);
		expand(this.canvas.width, top);
		expand(this.canvas.width, this.canvas.height);
		this.x0 = Math.max(this.field.x0, x0);
		this.x1 = Math.min(this.field.x1, x1);
		this.y0 = Math.max(this.field.y0, y0);
		this.y1 = Math.min(this.field.y1, y1);
	}
	tick = 0;
	this.makeNewParticles(animator);
};


MotionDisplay.prototype.animate = function(animator) {
	this.moveThings(animator);
  this.draw(animator);
}


MotionDisplay.prototype.move = function(animator) {
	var w = this.canvas.width;
	var h = this.canvas.height;
	var g = this.canvas.getContext('2d');
	
	g.fillStyle = this.outsideColor;
	var dx = animator.dx;
	var dy = animator.dy;
	var scale = animator.scale;

	g.fillRect(0, 0, w, h);
	g.fillStyle = this.background;
  g.fillRect(dx, dy, w * scale, h * scale);
	var z = animator.relativeZoom();
	var dx = animator.dx - z * animator.dxStart;
	var dy = animator.dy - z * animator.dyStart;
	g.drawImage(this.imageCanvas, dx, dy, z * w, z * h);
};

MotionDisplay.prototype.moveThings = function(animator) {
	var speed = .01 * this.speedScale / animator.scale;
	for (var i = 0; i < this.particles.length; i++) {
		var p = this.particles[i];
		if (p.age > 0 && this.field.inBounds(p.x, p.y)) {
		  var a = this.field.getValue(p.x, p.y);
			//console.log(a)
			p.x += speed * a.x;
			p.y += speed * a.y;
			p.age--;
		} else {
			this.particles[i] = this.makeParticle(animator);
		}
	}
};

var count = 0;
MotionDisplay.prototype.draw = function(animator) {
	count++;
	//console.log(count)
	var g = this.canvas.getContext('2d');
	var w = this.canvas.width;
	var h = this.canvas.height;
	if (this.first) {
		g.fillStyle =  'rgba(40,40,40,0.02)';
		this.first = false;
	} else {
		g.fillStyle = this.backgroundAlpha;
	}
	var dx = animator.dx;
	var dy = animator.dy;
	var scale = animator.scale;

	g.fillRect(dx, dy, w * scale,h * scale);
	var proj = new Vector(0, 0);
	var val = new Vector(0, 0);
	g.lineWidth = .75;
	for (var i = 0; i < this.particles.length; i++) {
		var p = this.particles[i];
		if (!this.field.inBounds(p.x, p.y)) {
			p.age = -2;
			continue;
		}
		this.projection.project(p.x, p.y, proj);
		proj.x = proj.x * scale + dx;
		proj.y = proj.y * scale + dy;
		if (proj.x < 0 || proj.y < 0 || proj.x > w || proj.y > h) {
			p.age = -2;
		}
		if (p.oldX != -1) {
			var wind = this.field.getValue(p.x, p.y, val);
			//console.log(wind)
			var s = wind.length() / this.maxLength;
			//console.log(s)
			var c = 90 + Math.round(350 * s); // was 400
			if (c > 255) {
				c = 255;
			} 
			g.strokeStyle = this.colors[c];
			//console.log(g.strokeStyle);
			g.beginPath();
			g.moveTo(proj.x, proj.y);
           // g.strokeStyle = this.colors[255-c];
			g.lineTo(p.oldX, p.oldY);
			/*console.log(proj.x)
			console.log(proj.y)
			console.log(p.oldX)
			console.log(p.oldY)*/
			g.stroke();
	  }
		p.oldX = proj.x;
		p.oldY = proj.y;
	}
	if(count ===80 ){
		return ;
	}
};

// please don't hate on this code too much.
// it's late and i'm tired.

var MotionDetails = function(div, callout, field, projection, animator) {
	$(callout).fadeOut();
	var moveTime = +new Date();
	var calloutOK = false;
	var currentlyShowing = false;
	var calloutX = 0;
	var calloutY = 0;
	var calloutHTML = '';
	var lastX = 0;
	var lastY = 0;

	function format(x) {
		x = Math.round(x * 10) / 10;
		var a1 = ~~x;
		var a2 = (~~(x * 10)) % 10;
		return a1 + '.' + a2;	
  } 

  function minutes(x) {	
		x = Math.round(x * 60) / 60;
		var degrees = ~~x;
		var m = ~~((x - degrees) * 60);
		return degrees + '&deg;&nbsp;' + (m == 0 ? '00' : m < 10 ? '0' + m : '' + m) + "'";
	}
	
	$(div).mouseleave(function() {
		moveTime = +new Date();
		calloutOK = false;
	});
	
	var pos = $(div).position();

	$(div).mousemove(function(e) {
		
		// TODO: REMOVE MAGIC CONSTANTS
		var x = e.pageX - this.offsetLeft - 60;
	  var y = e.pageY - this.offsetTop - 10;
		if (x == lastX && y == lastY) {
			return;
		}
		lastX = x;
		lastY = y;
		moveTime = +new Date();
		var scale = animator.scale;
		var dx = animator.dx;
		var dy = animator.dy;
		var mx = (x - dx) / scale;
		var my = (y - dy) / scale;
		var location = projection.invert(mx, my);
		var lat = location.y;
		var lon = location.x;
		var speed = 0;
		if (field.inBounds(lon, lat)) {
		  speed = field.getValue(lon, lat).length() / 1.15;
	  }
		calloutOK = !!speed;
		calloutHTML = '<div style="padding-bottom:5px"><b>' +
		              format(speed)  + ' mph</b> wind speed<br></div>' +
		              minutes(lat) + ' N, ' +
		              minutes(-lon) + ' W<br>' +
									'click to zoom';
	                  
		calloutY = (pos.top + y) + 'px';
		calloutX = (pos.left + x + 20) + 'px';
	});
	
	setInterval(function() {
		var timeSinceMove = +new Date() - moveTime;
		if (timeSinceMove > 200 && calloutOK) {
			if (!currentlyShowing) {
	  	  callout.innerHTML = calloutHTML;
				callout.style.left = calloutX;
				callout.style.top = calloutY;
				callout.style.visibility = 'visible';
				$(callout).fadeTo(400, 1);
				currentlyShowing = true;
			}
		} else if (currentlyShowing) {
	  	$(callout).fadeOut('fast');
			currentlyShowing = false;
		}
	}, 50);
};

/**
 * The cities array contains objects with properties: city, state, lat, lon, pop.
 *
 * @param {Array.<Object>} cities
 * @param {Object} canvas
 * @param {Object} projection
 */



var windData;
var cities ;

var field ;

var mapAnimator;
var legendSpeeds;
$.getJSON('/data/field.json',function(t){
    console.log('111111111111111111111111')
    t = t.map(function (t2) {
        return t2*Math.random()*100
    })
    windData = {
        timestamp: "3:36 am on January 25, 2018",
        x0: -130.103438,
        y0: 20.191999,
        x1: -60.885558,
        y1: 52.807669,
        gridWidth: 325.0,
        gridHeight: 319.0,
        field: t
    }



    field = VectorField.read(windData, true);

    legendSpeeds = [1, 3, 5, 10, 15, 30];
})


var MapMask = function(image, width, height) {
	this.image = image;
	this.width = width;
	this.height = height;
};

MapMask.prototype.endMove = function(animator) {
	this.move(animator);
}

MapMask.prototype.move = function(animator) {
	var s = this.image.style;
	s.width = ~~(animator.scale * this.width) + 'px';
	s.height = ~~(animator.scale * this.height) + 'px';
	s.left = animator.dx + 'px';
	s.top = animator.dy + 'px';
};

function isAnimating() {
	return document.getElementById('animating').checked;
}

function showCities() {
	document.getElementById('city-display').style.visibility =
	    document.getElementById('show-cities').checked ? 'visible' : 'hidden';
}

function doUnzoom() {
	mapAnimator.unzoom();
}

function format(x) {
	x = Math.round(x * 10) / 10;
	var a1 = ~~x;
	var a2 = (~~(x * 10)) % 10;
	return a1 + '.' + a2;	
}

function init() {
	loading = false;
	var timestamp = windData.timestamp || 'unknown on unknown';
	var parts = timestamp.split('on');
	var time = parts[0].trim();
	var day = parts[1].trim().replace(' 0', ' '); // correct "01" dates.
	day = day.replace('September', 'Sept.'); // No room for full "September".
	day = day.replace('November', 'Nov.'); // No room for full "November".
	day = day.replace('December', 'Dec.'); // No room for full "December".
	document.getElementById('update-time').innerHTML =
	   '<span id="day">' + day +'</span><br>' + time + ' EST' +
		 '<br><span id="time-explanation">(time of forecast download)</span>';

	var avg = field.averageLength / 1.15; // knots --> miles per hour
  var max = field.maxLength / 1.15;
		document.getElementById('average-speed').innerHTML =
	    '<br>top speed: <b>' + format(max) + ' mph</b><br>' +
			'average: <b>' + format(avg) + ' mph</b>';

	var canvas = document.getElementById('display');
	var imageCanvas = document.getElementById('image-canvas');
	var mapProjection = new ScaledAlbers(
	    1111, -75, canvas.height - 100, -126.5, 23.5);
	var isMacFF = navigator.platform.indexOf('Mac') != -1 &&
	              navigator.userAgent.indexOf('Firefox') != -1;
	var isWinFF = navigator.platform.indexOf('Win') != -1 &&
	              navigator.userAgent.indexOf('Firefox') != -1;
	var isWinIE = navigator.platform.indexOf('Win') != -1 &&
	              navigator.userAgent.indexOf('MSIE') != -1;
	var numParticles = isMacFF || isWinIE ? 3500 : 2000; // slowwwww browsers
    console.log(field);
    var display = new MotionDisplay(canvas, imageCanvas, field,
	                                numParticles, mapProjection);
console.log(display)
  // IE & FF Windows do weird stuff with very low alpha.
  if (isWinFF || isWinIE) {
		display.setAlpha(.05);
	}

  var navDiv = document.getElementById("city-display");
	var unzoom = document.getElementById('unzoom');
	mapAnimator = new Animator(navDiv, isAnimating, unzoom);
	mapAnimator.add(display);
	
	var mask = new MapMask(document.getElementById('mask'), 900, 600);
	mapAnimator.add(mask);
	
	var callout = document.getElementById('callout');
	var hovercard = new MotionDetails(navDiv, callout, field,
	                                  mapProjection, mapAnimator);

	var cityCanvas = document.getElementById('city-display');
	mapAnimator.add(cityDisplay);
	cityDisplay.move();
	console.log(cityDisplay)


  // Scale for speed.
	// Numerator comes from size of map.
	// Denominator is knots vs. mph.
	console.log(mapAnimator)
	console.log(legendAnimator)
	mapAnimator.start(40);
	//legendAnimator.start(40);
}
