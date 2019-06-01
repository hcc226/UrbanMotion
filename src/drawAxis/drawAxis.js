class axisView{
    constructor(sort_lines,type){
        console.log("new axisview")
        var data = [];
        sort_lines.forEach(function (d,i) {
            data.push({
                "num":i,
                "weight":d
            })
        })
        console.log(data)
        var margin = {top: 10, right: 20, bottom: 20, left: 45},
            width = 280 - margin.left - margin.right,
            height = 100 - margin.top - margin.bottom;

// parse the date / time

// set the ranges
        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

// define the line
        var valueline = d3.line()
            .x(function (d) {
                return x(d.num);
            })
            .y(function (d) {
                return y(d.weight);
            });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
        var svg;
        if(type == "com"){
            var margin2 = {top: 30, right: 20, bottom: 20, left: 45},
                width2 = 280 - margin2.left - margin2.right,
                height2 = 130 - margin2.top - margin2.bottom;
            svg = d3.select(".com-axis").append("svg")
                .attr("width", width2 + margin2.left + margin2.right)
                .attr("height", height2 + margin2.top + margin2.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin2.left + "," + margin2.top + ")");
        }
        else{
            svg = d3.select(".edge-axis").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
        }

// Get the data

        // format the data


        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.num;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.weight;
        })]);
        this.x = x;
        this.y = y;

        // Add the valueline path.
        this.line = svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the X Axis
        this.axisX = svg.append("g")
            .attr("transform", "translate(0," + height + ")");

        this.axisX.call(d3.axisBottom(x));

        // Add the Y Axis
        this.axisY = svg.append("g");
          this.axisY.call(d3.axisLeft(y));
    }
    updateData(sort_lines){
        //this.sort_lines = sort_lins
        var data = [];
        sort_lines.forEach(function (d,i) {
            data.push({
                "num":i,
                "weight":d
            })
        })
        this.x.domain(d3.extent(data, function (d) {
            return d.num;
        }));
        this.y.domain([0, d3.max(data, function (d) {
            return d.weight;
        })]);
        this.axisX.call(d3.axisBottom(this.x));
        this.axisY.call(d3.axisLeft(this.y));
    }
}


export {axisView}