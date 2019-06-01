function generate(tree, path, drawedSet) {
    // console.log("generate")
    this.latLngNodes = [];


    if (this.pertreeNodes && this.pertreeNodes.length != 0) {

        //console.log(this.pertreeNodes);
        this.allLatLngNodes.push([].concat(this.pertreeNodes))
    }
    /* console.log("maxSteplen is " + this.maxStepLen)
     console.log(this.allLatLngNodes)*/
    this.pertreeNodes = [];

    //
    drawTree(tree, path, drawedSet)

    // 添加根节点有多个孩子的情况
    //   if (tree.children.length == 1){
    //       this.drawTree(tree, path, drawedSet)
    //   }
    //   else if(tree.children.length>1) {
    //       path.push(tree.root.lng, tree.root.lat)
    //       if (tree.root.num) {
    //           path.push(tree.root.num)
    //       }
    //       else {
    //           path.push(0)
    //       }
    //       path.push(tree.root.speed)
    //       for(let i=0; i<tree.children.length;i++){
    //           this.drawTree(tree.children[i], path, drawedSet)
    //       }
    //   }


}

function drawTree(tree, path, drawedSet) {
    let self = this;
    this.tree = tree;
    //console.log(tree);
    //console.log(tree)
    if (tree.children) {
        // if (tree.children.length > 1) {
        //     alert("found tree")
        // }
        path.push(tree.root.lng, tree.root.lat)
        if (tree.root.num) {
            path.push(tree.root.num)
        }
        else {
            path.push(0)
        }
        path.push(tree.root.speed)
        var max = 0;
        var index = 0;
        for (var i = 0; i < tree.children.length; i++) {
            var subTree = tree.children[i];
            if (subTree.root.num > max && subTree.root.num != 0) {
                max = subTree.root.num;
                index = i;
            }
        }

       drawTree(tree.children[index], path, drawedSet)

        if(tree.children.length > 1){
            //tree.children[index].root.num = 0;
            //tree.root.num = 0;

            //path = []

            for (var j = 0; j < tree.children.length; j++) {
                //if (tree.children[j].root.num != 0) {
                if (index != j) {
                    path = [tree.root.lng,tree.root.lat,0,tree.root.speed ]
                    //this.drawTree(tree, path, drawedSet)
                    drawTree(tree.children[j], path, drawedSet)
                    drawedSet.add(path)
                }
            }
        }

    }
    else {
        path.push(tree.root.lng, tree.root.lat, tree.root.num, tree.root.speed)
        // console.log(path)
        console.log(path)
        //this.drawSpline(path, drawedSet)
        return;
    }
}

var tree = [{
    root: {
        num: 0,
        lat: 39.9195,
        gid: "30089",
        lng: 116.6348,
        speed: 0,
        id: 507,
        dis: 0
    },
    children: [
        {
            root: {
                num: 11,
                lat: 39.9195,
                lng: 116.6412,
                speed: 2.922289,
                id: 509,
                dis: 545.7957939650051
            },
            children: [
                {
                    root: {
                        num: 31,
                        lat: 39.9195,
                        lng: 116.6476,
                        speed: 3.236718,
                        id: 511,
                        dis: 1091.5915879278405
                    },
                    children: [
                        {
                            root: {
                                num: 35,
                                lat: 39.9195,
                                lng: 116.654,
                                speed: 3.637602,
                                id: 513,
                                dis: 1637.3873818928455
                            },
                            children: [
                                {
                                    root: {
                                        num: 42,
                                        lat: 39.9195,
                                        lng: 116.6604,
                                        speed: 3.415169,
                                        id: 515,
                                        dis: 2183.183175855681
                                    },
                                    children: [
                                        {
                                            root: {
                                                num: 10,
                                                lat: 39.917,
                                                lng: 116.66279458477806,
                                                speed: 6.712389,
                                                id: 517,
                                                dis: 2528.1191874307833
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            root: {
                                num: 35,
                                lat: 39.9195,
                                lng: 116.654,
                                speed: 3.637602,
                                id: 518,
                                dis: 1637.3873818928455
                            },
                            children: [
                                {
                                    root: {
                                        num: 15,
                                        lat: 39.9245,
                                        lng: 116.6604,
                                        speed: 4.013223,
                                        id: 520,
                                        dis: 2416.4760094645767
                                    },
                                    children: [
                                        {
                                            root: {
                                                num: 46,
                                                lat: 39.9295,
                                                lng: 116.6668,
                                                speed: 6.550689,
                                                id: 522,
                                                dis: 3195.5367169800606
                                            },
                                            children: [
                                                {
                                                    root: {
                                                        num: 56,
                                                        lat: 39.9345,
                                                        lng: 116.6732,
                                                        speed: 6.283489,
                                                        id: 524,
                                                        dis: 3974.569502569588
                                                    },
                                                    children: [
                                                        {
                                                            root: {
                                                                num: 16,
                                                                lat: 39.9345,
                                                                lng: 116.6796,
                                                                speed: 4.808255,
                                                                id: 526,
                                                                dis: 4520.245721424511
                                                            },
                                                            children: [
                                                                {
                                                                    root: {
                                                                        num: 20,
                                                                        lat: 39.93505091516811,
                                                                        lng: 116.68280000000001,
                                                                        speed: 3.685647,
                                                                        id: 528,
                                                                        dis: 4799.875291367265
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            root: {
                                num: 35,
                                lat: 39.9195,
                                lng: 116.654,
                                speed: 3.637602,
                                id: 529,
                                dis: 1637.3873818928455
                            },
                            children: [
                                {
                                    root: {
                                        num: 10,
                                        lat: 39.917,
                                        lng: 116.65658758977015,
                                        speed: 10.566041,
                                        id: 531,
                                        dis: 1992.3162478297636
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            root: {
                num: 11,
                lat: 39.9195,
                lng: 116.6412,
                speed: 2.922289,
                id: 532,
                dis: 545.7957939650051
            },
            children: [
                {
                    root: {
                        num: 16,
                        lat: 39.9245,
                        lng: 116.6476,
                        speed: 4.760867,
                        id: 534,
                        dis: 1324.8844215367362
                    },
                    children: [
                        {
                            root: {
                                num: 29,
                                lat: 39.923385337518226,
                                lng: 116.6508,
                                speed: 3.434117,
                                id: 536,
                                dis: 1624.5941400941883
                            }
                        }
                    ]
                },
                {
                    root: {
                        num: 16,
                        lat: 39.9245,
                        lng: 116.6476,
                        speed: 4.760867,
                        id: 537,
                        dis: 1324.8844215367362
                    },
                    children: [
                        {
                            root: {
                                num: 14,
                                lat: 39.9243722342985,
                                lng: 116.6508,
                                speed: 3.690689,
                                id: 539,
                                dis: 1598.132223667712
                            }
                        }
                    ]
                }
            ]
        }
    ]
},
    {
        root: {
            num: 0,
            lat: 39.9195,
            gid: "30089",
            lng: 116.6348,
            speed: 0,
            id: 540,
            dis: 0
        },
        children: [
            {
                root: {
                    num: 12,
                    lat: 39.92038145521231,
                    lng: 116.638,
                    speed: 4.279653,
                    id: 542,
                    dis: 289.96365269687135
                }
            }
        ]
    },
    {
        root: {
            num: 0,
            lat: 39.9195,
            gid: "30089",
            lng: 116.6348,
            speed: 0,
            id: 543,
            dis: 0
        },
        children: [
            {
                root: {
                    num: 13,
                    lat: 39.9195,
                    lng: 116.6284,
                    speed: 5.147288,
                    id: 545,
                    dis: 545.7957939628353
                },
                children: [
                    {
                        root: {
                            num: 22,
                            lat: 39.9145,
                            lng: 116.622,
                            speed: 5.078056,
                            id: 547,
                            dis: 1324.9123397174278
                        },
                        children: [
                            {
                                root: {
                                    num: 11,
                                    lat: 39.913367554178905,
                                    lng: 116.6188,
                                    speed: 7.513589,
                                    id: 549,
                                    dis: 1625.4814285391353
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        root: {
            num: 0,
            lat: 39.9195,
            gid: "30089",
            lng: 116.6348,
            speed: 0,
            id: 550,
            dis: 0
        },
        children: [
            {
                root: {
                    num: 15,
                    lat: 39.9145,
                    lng: 116.6284,
                    speed: 5.765388,
                    id: 552,
                    dis: 779.1165457530722
                },
                children: [
                    {
                        root: {
                            num: 21,
                            lat: 39.91275919638628,
                            lng: 116.62519999999999,
                            speed: 6.23505,
                            id: 554,
                            dis: 1113.713028985448
                        }
                    }
                ]
            }
        ]
    },
    {
        root: {
            num: 0,
            lat: 39.9195,
            gid: "30089",
            lng: 116.6348,
            speed: 0,
            id: 555,
            dis: 0
        },
        children: [
            {
                root: {
                    num: 16,
                    lat: 39.9245,
                    lng: 116.6348,
                    speed: 2.25657,
                    id: 557,
                    dis: 555.9746332234664
                },
                children: [
                    {
                        root: {
                            num: 13,
                            lat: 39.9295,
                            lng: 116.6348,
                            speed: 2.249858,
                            id: 559,
                            dis: 1111.9492664455183
                        },
                        children: [
                            {
                                root: {
                                    num: 19,
                                    lat: 39.931999999999995,
                                    lng: 116.63494252353064,
                                    speed: 5.609929,
                                    id: 561,
                                    dis: 1390.2020854970588
                                }
                            }
                        ]
                    }
                ]
            },
            {
                root: {
                    num: 16,
                    lat: 39.9245,
                    lng: 116.6348,
                    speed: 2.25657,
                    id: 562,
                    dis: 555.9746332234664
                },
                children: [
                    {
                        root: {
                            num: 10,
                            lat: 39.927,
                            lng: 116.63480596001787,
                            speed: 2.853552,
                            id: 564,
                            dis: 833.9624144145789
                        }
                    }
                ]
            }
        ]
    },
    {
        root: {
            num: 0,
            lat: 39.9195,
            gid: "30089",
            lng: 116.6348,
            speed: 0,
            id: 565,
            dis: 0
        },
        children: [
            {
                root: {
                    num: 37,
                    lat: 39.9145,
                    lng: 116.6348,
                    speed: 3.883996,
                    id: 567,
                    dis: 555.974633222759
                },
                children: [
                    {
                        root: {
                            num: 15,
                            lat: 39.9095,
                            lng: 116.6348,
                            speed: 4.169811,
                            id: 569,
                            dis: 1111.949266445518
                        },
                        children: [
                            {
                                root: {
                                    num: 30,
                                    lat: 39.9045,
                                    lng: 116.6348,
                                    speed: 3.527475,
                                    id: 571,
                                    dis: 1667.923899668277
                                },
                                children: [
                                    {
                                        root: {
                                            num: 39,
                                            lat: 39.8995,
                                            lng: 116.6348,
                                            speed: 3.141422,
                                            id: 573,
                                            dis: 2223.898532890329
                                        },
                                        children: [
                                            {
                                                root: {
                                                    num: 62,
                                                    lat: 39.8945,
                                                    lng: 116.6348,
                                                    speed: 5.229592,
                                                    id: 575,
                                                    dis: 2779.8731661137954
                                                },
                                                children: [
                                                    {
                                                        root: {
                                                            num: 61,
                                                            lat: 39.8895,
                                                            lng: 116.6348,
                                                            speed: 5.350526,
                                                            id: 577,
                                                            dis: 3335.8477993365545
                                                        },
                                                        children: [
                                                            {
                                                                root: {
                                                                    num: 63,
                                                                    lat: 39.887,
                                                                    lng: 116.63452586922887,
                                                                    speed: 4.787024,
                                                                    id: 579,
                                                                    dis: 3614.8172949393843
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                root: {
                                                    num: 62,
                                                    lat: 39.8945,
                                                    lng: 116.6348,
                                                    speed: 5.229592,
                                                    id: 580,
                                                    dis: 2779.8731661137954
                                                },
                                                children: [
                                                    {
                                                        root: {
                                                            num: 10,
                                                            lat: 39.892,
                                                            lng: 116.63459746100764,
                                                            speed: 4.73077,
                                                            id: 582,
                                                            dis: 3058.396991284272
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }]
tree.forEach(function (t) {
    var path = []
    var set1 = new Set()
    generate(t,path,set1)
})
    [ 116.6348,
    39.9195,
    0,
    0,
    116.6412,
    39.9195,
    11,
    2.922289,
    116.6476,
    39.9195,
    31,
    3.236718,
    116.654,
    39.9195,
    35,
    3.637602,
    116.6604,
    39.9195,
    42,
    3.415169,
    116.66279458477806,
    39.917,
    10,
    6.712389 ]
    [ 116.6476,
    39.9195,
    0,
    3.236718,
    116.654,
    39.9195,
    35,
    3.637602,
    116.6604,
    39.9245,
    15,
    4.013223,
    116.6668,
    39.9295,
    46,
    6.550689,
    116.6732,
    39.9345,
    56,
    6.283489,
    116.6796,
    39.9345,
    16,
    4.808255,
    116.68280000000001,
    39.93505091516811,
    20,
    3.685647 ]
    [ 116.6476,
    39.9195,
    0,
    3.236718,
    116.654,
    39.9195,
    35,
    3.637602,
    116.65658758977015,
    39.917,
    10,
    10.566041 ]
    [ 116.6348,
    39.9195,
    0,
    0,
    116.6412,
    39.9195,
    11,
    2.922289,
    116.6476,
    39.9245,
    16,
    4.760867,
    116.6508,
    39.923385337518226,
    29,
    3.434117 ]
    [ 116.6412,
    39.9195,
    0,
    2.922289,
    116.6476,
    39.9245,
    16,
    4.760867,
    116.6508,
    39.9243722342985,
    14,
    3.690689 ]
    [ 116.6348, 39.9195, 0, 0, 116.638, 39.92038145521231, 12, 4.279653 ]
    [ 116.6348,
    39.9195,
    0,
    0,
    116.6284,
    39.9195,
    13,
    5.147288,
    116.622,
    39.9145,
    22,
    5.078056,
    116.6188,
    39.913367554178905,
    11,
    7.513589 ]
    [ 116.6348,
    39.9195,
    0,
    0,
    116.6284,
    39.9145,
    15,
    5.765388,
    116.62519999999999,
    39.91275919638628,
    21,
    6.23505 ]
    [ 116.6348,
    39.9195,
    0,
    0,
    116.6348,
    39.9245,
    16,
    2.25657,
    116.6348,
    39.9295,
    13,
    2.249858,
    116.63494252353064,
    39.931999999999995,
    19,
    5.609929 ]
    [ 116.6348,
    39.9195,
    0,
    0,
    116.6348,
    39.9245,
    16,
    2.25657,
    116.63480596001787,
    39.927,
    10,
    2.853552 ]
    [ 116.6348,
    39.9195,
    0,
    0,
    116.6348,
    39.9145,
    37,
    3.883996,
    116.6348,
    39.9095,
    15,
    4.169811,
    116.6348,
    39.9045,
    30,
    3.527475,
    116.6348,
    39.8995,
    39,
    3.141422,
    116.6348,
    39.8945,
    62,
    5.229592,
    116.6348,
    39.8895,
    61,
    5.350526,
    116.63452586922887,
    39.887,
    63,
    4.787024 ]
    [ 116.6348,
    39.8995,
    0,
    3.141422,
    116.6348,
    39.8945,
    62,
    5.229592,
    116.63459746100764,
    39.892,
    10,
    4.73077 ]