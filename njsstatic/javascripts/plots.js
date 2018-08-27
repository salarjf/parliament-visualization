var mosharekat_pie=$('#mosharekat-pie');
var mosharekat_stack=$('#mosharekat-stack');
var tazakor_pie=$('#tazakor-pie');
var tazakor_stack=$('#tazakor-stack');
var soal_stack=$('#soal-stack');
var soal_pie=$('#soal-pie');

function piecreator(data,element) {
    element.highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        tooltip: {
            pointFormat: '{series.name}: <b> {point.percentage:.1f} </b>'
        },
        title: {
            text: null
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: true

            }
        },
        series: data,
    });
};

function stackcreator(data,cat,element) {
    element.highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: null
        },
        xAxis: {
            categories: cat
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: data,
    });
}

//
function drawTazakor(nid){
    var nidurl=nid;
    $.ajax({
        url: '/tazakor/'+nidurl,
        type: "GET",
        dataType: "json",
        success:function(data){
            var piedata=[{name:"درصد" , data:[]}];
            for ( var i in data)
            {
                piedata[0].data.push({name: data[i].name ,y: data[i].y})
            }
            var stackcat=[];
            for ( var i in data)
            {
                stackcat.push(data[i].name);
            }
            var stackmain=[{name:"تعداد کل تذکرات داده شده به وزارت",data:[]},{name:"تعداد تذکرات این نماینده از وزارت",data:[]}];
            for ( var i in data)
            {
                stackmain[1].data.push(data[i].y);
            }

            for ( var i in data)
            {
                stackmain[0].data.push(data[i].total-data[i].y);
            }

            piecreator(piedata,tazakor_pie);
            stackcreator(stackmain,stackcat,tazakor_stack);
        },
        cache: true,
    });
}
function drawSoal(nid){
    var nidurl=nid;

    $.ajax({
        url: '/soal/'+nidurl,
        type: "GET",
        dataType: "json",
        success:function(data){
            var piedata=[{name:"درصد" , data:[]}];
            for ( var i in data)
            {
                piedata[0].data.push({name: data[i].name ,y: data[i].y})
            }
            var stackcat=[];
            for ( var i in data)
            {
                stackcat.push(data[i].name);
            }
            var stackmain=[{name:"تعداد کل سوالات پرسیده شده از وزارت",data:[]},{name:"تعداد سوالات این نماینده از وزارت",data:[]}];
            for ( var i in data)
            {
                stackmain[1].data.push(data[i].y);
            }

            for ( var i in data)
            {
                stackmain[0].data.push(data[i].total-data[i].y);
            }

            piecreator(piedata,soal_pie);
            stackcreator(stackmain,stackcat,soal_stack);
        },
        cache: true,
    });
}

function drawMosharekat(nid){
    var nidurl=nid;
    $.ajax({
        url: '/mosharekat/'+nidurl,
        type: "GET",
        dataType: "json",
        success:function(data){
            var piedata=[{name:"درصد" , data:[]}];
            for ( var i in data)
            {
                piedata[0].data.push({name: data[i].name ,y: data[i].y})
            }
            var stackcat=[];
            for ( var i in data)
            {
                stackcat.push(data[i].name);
            }
            var stackmain=[{name:"تعداد کل طرح های کمیسیون",data:[]},{name:"تعداد طرح های این نماینده",data:[]}];
            for ( var i in data)
            {
                stackmain[1].data.push(data[i].y);
            }

            for ( var i in data)
            {
                stackmain[0].data.push(data[i].total-data[i].y);
            }

            piecreator(piedata,mosharekat_pie);
            stackcreator(stackmain,stackcat,mosharekat_stack);
        },
        cache: true,
    });    
}

function drawTazakorHistogram(totaltazakor){
    d3.csv("/njsstatic/Data/tazakorat.csv", function(data) {
    //load CSVfile here
    map = data.map(function(d) { return parseInt(d.tazakorat); });
    var formatCount = d3.format(",.0f");
    var margin = {top: 30, right: 0, bottom: 40, left: 50},
    width = 570 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

    ///inja range mehvare x ro taeenm
    var x = d3.scale.linear()
        .domain([0, 700])
        .range([0, width-10]);
    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(40)
        (map);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })+10])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#tazakor-histogram").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    var mizanetakhir=parseInt(totaltazakor);
    var BinCount=null;
    var binstart=null;
    var binsend=null;

    bar.append("rect")
        .attr("width", x(data[0].dx))
        .attr("height", function(d) { return height - y(d.y); })
        .style("fill",function(d){
            if (d.x<=mizanetakhir&&mizanetakhir<=d.x+d.dx)
            {

                return "#FF9933";           
            }
            else
            {
                return"#7cb5ec"; 
            }
        })
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -15)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .style("fill",function(d){
            if (d.x<=mizanetakhir&&mizanetakhir<=d.x+d.dx)
            {
                BinCount=Math.floor( d.y).toString();
                binstart=Math.floor(d.x).toString();
                binsend=Math.floor(d.x+d.dx).toString();
                return "#FF9933";

            }
            else
            {
                return"#ffffff"; 
            }
        })
        .style("font-size", "11px")
        .text(function(d) { 
            if (d.y!=0){
                return formatCount(d.y);                    
            }});

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("text")
        .attr("x", (width / 2)+20)             
        .attr("y", 70 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "15px") 
        .style("font-weight", "bold") 
        .text("ایشان جز "+BinCount+" نماینده ای هستند که "+binstart+" تا "+binsend+" تعداد تذکر داشته اند");
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 310)
        .attr("text-anchor", "middle")  
        .style("font-size", "13px")
        .text("تعداد تذکرات");
    svg.append("text")
        .attr("y", -40)             
        .attr("x", -130)             
        .attr("dy", ".75em")
        .attr("text-anchor", "end")  
        .style("font-size", "13px") 
        .attr("transform", "rotate(-90)")
        .text("تعداد نمایندگان"); 
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
});
}
function drawAdamHistogram(totaladam){

   d3.csv("/njsstatic/Data/adam.csv", function(data) {
    //load CSVfile here
    map = data.map(function(d) { return parseInt(d.mizan); });
    var formatCount = d3.format(",.0f");
    var margin = {top: 30, right: 0, bottom: 40, left: 50},
    width = 570 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

    ///inja range mehvare x ro taeenm
    var x = d3.scale.linear()
        .domain([0, 4000])
        .range([0, width-10]);
    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(40)
        (map);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#adamplot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    var mizanetakhir=parseInt(totaladam);

    var BinCount=null;
    bar.append("rect")
        .attr("width", x(data[0].dx))
        .attr("height", function(d) { return height - y(d.y); })
        .style("fill",function(d){
            if ((d.x<mizanetakhir&&mizanetakhir<d.x+d.dx)||(d.x==mizanetakhir))
            {
                return "#FF9933";           
            }
            else
            {
                return"#7cb5ec"; 
            }
        });

    var binstart=null;
    var binsend=null;
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -15)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .style("fill",function(d){
            if ((d.x<mizanetakhir&&mizanetakhir<d.x+d.dx)||(d.x==mizanetakhir))
            {
                BinCount=Math.floor( d.y).toString();
                binstart=Math.floor(d.x).toString();
                binsend=Math.floor(d.x+d.dx).toString();
                return "#FF9933";

            }
            else
            {
                return"#ffffff"; 
            }
        })
        .style("font-size", "11px")
        .text(function(d) { 
            if (d.y!=0){
                return formatCount(d.y);                    
            }});

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        binstart=Math.floor(binstart);
        binsend=Math.floor(binsend);
    svg.append("text")
        .attr("x", (width / 2)+30)             
        .attr("y", 70 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "15px") 
        .style("font-weight", "bold") 
        .text("ایشان جز "+BinCount+" نماینده گانی هستند که "+binstart+" تا "+binsend+" دقیقه در جلسات حضور نداشتند");
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 310)
        .attr("text-anchor", "middle")  
        .style("font-size", "13px")
        .text("دقیقه");
    svg.append("text")
        .attr("y", -40)             
        .attr("x", -130)             
        .attr("dy", ".75em")
        .attr("text-anchor", "end")  
        .style("font-size", "13px") 
        .attr("transform", "rotate(-90)")
        .text("تعداد نمایندگان"); 
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
});

}
function drawMosharekatHistogram(tedadetarh){
   d3.csv("/njsstatic/Data/tarh.csv", function(data) {
    //load CSVfile here
    map = data.map(function(d) { return parseInt(d.tedadetarh); });
    var formatCount = d3.format(",.0f");
    var margin = {top: 30, right: 0, bottom: 40, left: 50},
    width = 570 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

    ///inja range mehvare x ro taeenm
    var x = d3.scale.linear()
        .domain([0, 150])
        .range([0, width-10]);
    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(40)
        (map);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#mosharekat-histogram").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
    var mizanetakhir=tedadetarh;
    var BinCount=null;
    bar.append("rect")
        .attr("width", x(data[0].dx))
        .attr("height", function(d) { return height - y(d.y); })
        .style("fill",function(d){
            if ((d.x<mizanetakhir&&mizanetakhir<d.x+d.dx)||(d.x==mizanetakhir))
            {
                return "#FF9933";           
            }
            else
            {
                return"#7cb5ec"; 
            }
        })
    var binstart=null;
    var binsend=null;
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -15)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .style("fill",function(d){
            if ((d.x<mizanetakhir&&mizanetakhir<d.x+d.dx)||(d.x==mizanetakhir))
            {
                BinCount=Math.floor(d.y).toString();
                binstart=Math.floor(d.x).toString();
                binsend=Math.floor(d.x+d.dx).toString();
                return "#FF9933";

            }
            else
            {
                return"#ffffff"; 
            }
        })
        .style("font-size", "11px")
        .text(function(d) { 
            if (d.y!=0){
                return formatCount(d.y);                    
            }});

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("text")
        .attr("x", (width / 2)+60)             
        .attr("y", 90 - (margin.top / 2))
        .attr("text-anchor", "right")  
        .style("font-size", "15px") 
        .style("font-weight","bold")
        .text("ایشان جز "+BinCount+" نماینده گانی هستند که ");
    svg.append("text")
        .attr("x", (width / 2)+75)             
        .attr("y", 115 - (margin.top / 2))
        .attr("text-anchor", "right")  
        .style("font-size", "15px") 
        .style("font-weight","bold")
        .text("از "+binstart+" تا "+binsend+" طرح امضا کرده اند");
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 310)
        .attr("text-anchor", "middle")  
        .style("font-size", "13px")
        .text("تعداد طرح ها");
    svg.append("text")
        .attr("y", -40)             
        .attr("x", -130)             
        .attr("dy", ".75em")
        .attr("text-anchor", "end")  
        .style("font-size", "13px") 
        .attr("transform", "rotate(-90)")
        .text("تعداد نمایندگان"); 

            
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
});

}
function drawSoalHistogram(tedadesoal){
   d3.csv("/njsstatic/Data/soal.csv", function(data) {
    //load CSVfile here
    map = data.map(function(d) { return parseInt(d.tedadesoal); });
    var formatCount = d3.format(",.0f");
    var margin = {top: 30, right: 0, bottom: 40, left: 50},
    width = 570 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

    ///inja range mehvare x ro taeenm
    var x = d3.scale.linear()
        .domain([0, 140])
        .range([0, width-10]);
    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(40)
        (map);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#soal-histogram").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
    var mizanetakhir=parseInt(tedadesoal);
    var BinCount=null;
    bar.append("rect")
        .attr("width", x(data[0].dx))
        .attr("height", function(d) { return height - y(d.y); })
        .style("fill",function(d){
            if (d.x<=mizanetakhir&&mizanetakhir<=d.x+d.dx)
            {
                return "#FF9933";           
            }
            else
            {
                return"#7cb5ec"; 
            }
        })
    var binstart=null;
    var binsend=null;
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -15)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .style("fill",function(d){
            if (d.x<=mizanetakhir&&mizanetakhir<=d.x+d.dx)
            {
                BinCount=Math.floor( d.y).toString();
                binstart=Math.floor(d.x).toString();
                binsend=Math.floor(d.x+d.dx).toString();
                return "#FF9933";

            }
            else
            {
                return"#ffffff"; 
            }
        })
        .style("font-size", "11px")
        .text(function(d) { 
            if (d.y!=0){
                return formatCount(d.y);                    
            }});

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("text")
        .attr("x", (width / 2)+20)             
        .attr("y", 70 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "15px") 
        .style("font-weight","bold")
        .text("ایشان جز "+BinCount+" نماینده گانی هستند که "+binstart+" تا "+binsend+" سوال از مخاطبین داشته اند");
    svg.append("text")
        .attr("x", (width / 2)+20)             
        .attr("y", 310)
        .attr("text-anchor", "middle")  
        .style("font-size", "13px") 
        .text("تعداد سوالات");

    svg.append("text")
        .attr("y", -40)             
        .attr("x", -130)             
        .attr("dy", ".75em")
        .attr("text-anchor", "end")  
        .style("font-size", "13px") 
        .attr("transform", "rotate(-90)")
        .text("تعداد نمایندگان"); 

            
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
});
}
function drawNotghHistogram(totalnotgh){
    d3.csv("/njsstatic/Data/notgh.csv", function(data) {
    //load CSVfile here
    map = data.map(function(d) { return parseInt(d.notgh); });
    var formatCount = d3.format(",.0f");
    var margin = {top: 30, right: 0, bottom: 40, left: 50},
    width = 570 - margin.left - margin.right,
    height = 370 - margin.top - margin.bottom;

    ///inja range mehvare x ro taeenm
    var x = d3.scale.linear()
        .domain([0, 16])
        .range([0, width-10]);
    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(40)
        (map);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })+10])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#notgh-histogram").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    var mizanetakhir=parseInt(totalnotgh);
    var BinCount=null;
    var binstart=null;
    var binsend=null;
    bar.append("rect")
        .attr("width", x(data[0].dx))
        .attr("height", function(d) { return height - y(d.y); })
        .style("fill",function(d){
            if (d.x<=mizanetakhir && mizanetakhir<=d.x+d.dx)
            {
                return "#FF9933";           
            }
            else
            {
                return"#7cb5ec"; 
            }
        })
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -15)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .style("fill",function(d){
            if (d.x<=mizanetakhir && mizanetakhir<=d.x+d.dx)
            {
                BinCount=Math.floor( d.y).toString();
                binstart=Math.floor(d.x).toString();
                binsend=Math.floor(d.x+d.dx).toString();
                return "#FF9933";

            }
            else
            {
                return"#ffffff"; 
            }
        })
        .style("font-size", "11px")
        .text(function(d) { 
            if (d.y!=0){
                return formatCount(d.y);                    
            }});

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")
        .attr("x", (width / 2)+20)             
        .attr("y", 70 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "15px") 
        .style("font-weight","bold")
        .text("ایشان جز "+BinCount+" نماینده ای هستند که "+binstart+" تا "+binsend+"نطق داشته اند");
    svg.append("text")
        .attr("x", (width / 2)+20)             
        .attr("y", 330)
        .attr("text-anchor", "middle")  
        .style("font-size", "13px") 
        .text("تعداد نطق"); 

    svg.append("text")
        .attr("y", -40)             
        .attr("x", -130)             
        .attr("dy", ".75em")
        .attr("text-anchor", "end")  
        .style("font-size", "13px") 
        .attr("transform", "rotate(-90)")
        .text("تعداد نمایندگان"); 

});
}
function setDarsadSoal(darsadsoal){
    
    $("#darsadsoal").append("<strong>"+darsadsoal+"</strong>")    
}

function setDarsadTazakor(darsadtazakor){
   
    $("#darsadtazakor").append("<strong>"+darsadtazakor+"</strong>");
}
function setDarsadMosharekat(tedad,darsadtarh,darsadnamayande){
    // $("#tedadmosharekat").append('<strong>تعداد طرح های امضا شده :   '+tedad+'('+darsadlavayeh+'درصد از کل طرح ها و لوایح )</strong>')    
    $("#darsadtarh").append("<strong>"+darsadtarh+"</strong>")    
}



function buildComisionTable(nid){
    $.ajax({
        url: '/comision/'+nid,
        type: "GET",
        dataType: "json",
        success:function(data){
            $("#comisiontablebody").append("<tr><td colspan=\"5\" style=\"text-align:center; font-size: 30px;\">"+data[0].comision1+"</td></tr><tr><td style=\"text-align:center;\" class=\"semat\" >"+data[0].semat+"</td><td style=\"text-align:center;\" class=\"semat\" >"+data[0].semat+"</td><td style=\"text-align:center;\" class=\"semat\" >"+data[0].semat+"</td><td style=\"text-align:center;\" class=\"semat\" >عضو</td><td style=\"text-align:center;\" > سمت</td></tr>")

        },
        cache: true
    });

}
function setDarsadAdam(darsadadam){
    $('#darsadadam').append("<strong>"+darsadadam.toString().substring(0,4)+"</strong>")

}
function setDarsadNotgh(darsadNotgh){
    $('#darsadnotgh').append("<strong>"+darsadNotgh.toString().substring(0,4)+"</strong>")
}

function drawMapDistribution(){
    var data = [
      {
        "value": 4,
        "name": "هرمزگان",
        "hc-key": "ir-hg"
      },
      {
        "value": 4,
        "name": "بوشهر",
        "hc-key": "ir-bs"
      },
      {
        "value": 3,
        "name": "کهگیلویه و بویر احمد",
        "hc-key": "ir-kb"
      },
      {
        "value": 18,
        "name": "فارس",
        "hc-key": "ir-fa"
      },
      {
        "value": 19,
        "name": "اصفهان",
        "hc-key": "ir-es"
      },
      {
        "value": 5,
        "name": "سمنان",
        "hc-key": "ir-sm"
      },
      {
        "value": 8,
        "name": "گلستان",
        "hc-key": "ir-go"
      },
      {
        "value": 11,
        "name": "مازندران",
        "hc-key": "ir-mn"
      },
      {
        "value": 42,
        "name": "تهران",
        "hc-key": "ir-th"
      },
      {
        "value": 6,
        "name": "مرکزی",
        "hc-key": "ir-mk"
      },
      {
        "value": 4,
        "name": "یزد",
        "hc-key": "ir-ya"
      },
      {
        "value": 4,
        "name": "چهار محال بختیاری",
        "hc-key": "ir-cm"
      },
      {
        "value": 18,
        "name": "خوزستان",
        "hc-key": "ir-kz"
      },
      {
        "value": 9,
        "name": "لرستان",
        "hc-key": "ir-lo"
      },
      {
        "value": 1,
        "name": "ایلام",
        "hc-key": "ir-il"
      },
      {
        "value": 7,
        "name": "اردبیل",
        "hc-key": "ir-ar"
      },
      {
        "value": 3,
        "name": "قم",
        "hc-key": "ir-qm"
      },
      {
        "value": 8,
        "name": "همدان",
        "hc-key": "ir-hd"
      },
      {
        "value": 5,
        "name": "زنجان",
        "hc-key": "ir-za"
      },
      {
        "value": 4,
        "name": "قزوین",
        "hc-key": "ir-qz"
      },
      {
        "value": 12,
        "name": "آذربایجان غربی",
        "hc-key": "ir-wa"
      },
      {
        "value": 19,
        "name": "آذربایجان شرقی",
        "hc-key": "ir-ea"
      },
      {
        "value": 8,
        "name": "کرمانشاه",
        "hc-key": "ir-bk"
      },
      {
        "value": 13,
        "name": "گیلان",
        "hc-key": "ir-gi"
      },
      {
        "value": 6,
        "name": "کردستان",
        "hc-key": "ir-kd"
      },
      {
        "value": 4,
        "name": "خراسان جنوبی",
        "hc-key": "ir-kj"
      },
      {
        "value": 13,
        "name": "خراسان رضوی",
        "hc-key": "ir-kv"
      },
      {
        "value": 9,
        "name": "خراسان شمالی",
        "hc-key": "ir-ks"
      },
      {
        "value": 8,
        "name": "سیستان و بلوچستان",
        "hc-key": "ir-sb"
      },
      {
        "value": 8,
        "name": "کرمان",
        "hc-key": "ir-ke"
      },
      {
        "value": 3,
        "name": "البرز",
        "hc-key": "ir-al"
  }];
  $.getJSON('/iranmap.geo.json',function(irangeo){
      $('#iranmap').highcharts('Map', {

      title : {
          text : 'Highmaps basic demo'
      },

      subtitle : {
          text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ir/ir-all.js">Iran</a>'
      },

      mapNavigation: {
          enabled: true,
          buttonOptions: {
              verticalAlign: 'bottom'
          }
      },

      colorAxis: {
          min: 0
      },

      series : [{
          data : data,
          mapData: irangeo,
          joinBy: 'hc-key',
          name: 'نعداد نمایندگان',
          states: {
              hover: {
                  color: '#BADA55'
              }
          },
          dataLabels: {
              enabled: true,
              format: '{point.name}'
          }
      }]
      });
  });
}
function drawMap(ostan_name){
    var data = [
      {
        "value": null,
        "name": "هرمزگان",
        "hc-key": "ir-hg"
      },
      {
        "value": null,
        "name": "بوشهر",
        "hc-key": "ir-bs"
      },
      {
        "value": null,
        "name": "کهگیلویه و بویر احمد",
        "hc-key": "ir-kb"
      },
      {
        "value": null,
        "name": "فارس",
        "hc-key": "ir-fa"
      },
      {
        "value": null,
        "name": "اصفهان",
        "hc-key": "ir-es"
      },
      {
        "value": null,
        "name": "سمنان",
        "hc-key": "ir-sm"
      },
      {
        "value": null,
        "name": "گلستان",
        "hc-key": "ir-go"
      },
      {
        "value": null,
        "name": "مازندران",
        "hc-key": "ir-mn"
      },
      {
        "value": null,
        "name": "تهران",
        "hc-key": "ir-th"
      },
      {
        "value": null,
        "name": "مرکزی",
        "hc-key": "ir-mk"
      },
      {
        "value": null,
        "name": "یزد",
        "hc-key": "ir-ya"
      },
      {
        "value": null,
        "name": "چهار محال بختیاری",
        "hc-key": "ir-cm"
      },
      {
        "value": null,
        "name": "خوزستان",
        "hc-key": "ir-kz"
      },
      {
        "value": null,
        "name": "لرستان",
        "hc-key": "ir-lo"
      },
      {
        "value": null,
        "name": "ایلام",
        "hc-key": "ir-il"
      },
      {
        "value": null,
        "name": "اردبیل",
        "hc-key": "ir-ar"
      },
      {
        "value": null,
        "name": "قم",
        "hc-key": "ir-qm"
      },
      {
        "value": null,
        "name": "همدان",
        "hc-key": "ir-hd"
      },
      {
        "value": null,
        "name": "زنجان",
        "hc-key": "ir-za"
      },
      {
        "value": null,
        "name": "قزوین",
        "hc-key": "ir-qz"
      },
      {
        "value": null,
        "name": "آذربایجان غربی",
        "hc-key": "ir-wa"
      },
      {
        "value": null,
        "name": "آذربایجان شرقی",
        "hc-key": "ir-ea"
      },
      {
        "value": null,
        "name": "کرمانشاه",
        "hc-key": "ir-bk"
      },
      {
        "value": null,
        "name": "گیلان",
        "hc-key": "ir-gi"
      },
      {
        "value": null,
        "name": "کردستان",
        "hc-key": "ir-kd"
      },
      {
        "value": null,
        "name": "خراسان جنوبی",
        "hc-key": "ir-kj"
      },
      {
        "value": null,
        "name": "خراسان رضوی",
        "hc-key": "ir-kv"
      },
      {
        "value": null,
        "name": "خراسان شمالی",
        "hc-key": "ir-ks"
      },
      {
        "value": null,
        "name": "سیستان و بلوچستان",
        "hc-key": "ir-sb"
      },
      {
        "value": null,
        "name": "کرمان",
        "hc-key": "ir-ke"
      },
      {
        "value": null,
        "name": "البرز",
        "hc-key": "ir-al"
  }];
  $.getJSON('/njsstatic/OstanDistribution.json',function(ostandis){

    $.each(ostandis, function(i, obj) {
      //use obj.id and obj.name here, for example:
      // alert(obj.name);
      if (obj.name==ostan_name)
      {
        $.each(data,function(j,object){
          if(object.name==ostan_name)
          {
            object.value=obj.value
          }
        })
      }
    });
  });

  $.getJSON('/njsstatic/iranmap.geo.json',function(irangeo){
      $('#iranmap').highcharts('Map', {
      width: 480,
      title : {
          text : null
      },

      subtitle : {
          text : null
      },

      mapNavigation: {
          enabled: false,
          buttonOptions: {
              verticalAlign: 'bottom'
          }
      },
      tooltip: {
            disable: false,
            borderRadius: 0,
            backgroundColor: '#FCFFC5',
      },
      legend:  {
        enabled:false
      },
      colorAxis: {
          min: 0
      },

      series : [{
          data : data,
          mapData: irangeo,
          joinBy: 'hc-key',
          name: null,
          states: {
              hover: {
                  color: '#BADA55'
              }
          },
          dataLabels: {
              enabled: true,
              format: '{point.name}'
          }
      }]
      });
  });

}
function wordCloudMaker(frequency_list,element){
    console.log("inside wc maker");
    $.getScript("/njsstatic/javascripts/wordcloud2.js", function(){
        //var pdiv = document.getElementById(element);
        function normalizeScores(max, min, orgArray){
            aMin = 100000000;
            aMax = -100000000;
            normArray = [];
            orgArray.forEach(function(item){
                if(aMin>item.size) aMin = item.size;
                if(aMax<item.size) aMax = item.size;
            },this);
            orgArray.forEach(function(item){
                var denm = aMax - aMin;
                if(denm ==0 ){
                    normArray.push([item.text,max]);
                }else{
                    var score = (max-min)/(aMax-aMin)*(item.size-aMax)+max;
                    normArray.push([item.text,score]);
                }
            },this);

            return normArray;
        }
        $('#'+element).replaceWith('<div class="col-md-12 chartcol"><a class="widget widget-hover-effect2"><div class="widget-simple themed-background-modern"><h4 class="widget-content widget-content-light text-center"><strong>کلمه گرافی</strong></h4></div><div id="sdiv_'+element+'" class="widget-extra wordcloud">'+'<canvas id="'+element+'_cCloud"></canvas>'+'</div></a></div>')
        var aList = normalizeScores(19,2,frequency_list);
        var div = document.getElementById("sdiv_"+element);

        var canvas = document.getElementById(element+"_cCloud");
        canvas.height = window.innerHeight*0.7;
        canvas.width = window.innerWidth*0.85;
        //canvas.height = div.offsetHeight;
        //canvas.width  = div.offsetWidth;
        var options =
        {
            ellipticity:1,
            fontFamily: 'yekan, serif',
            list : aList,
            gridSize: Math.round(16 * document.getElementById(element+"_cCloud").offsetWidth / 1024),
            weightFactor: function (size) {
                return Math.pow(size, 1.9) * document.getElementById(element+"_cCloud").offsetWidth / 1024;
            }
        }

        WordCloud(document.getElementById(element+"_cCloud"), options);
    });
}


function drawAllWordClouds(nid){


    $.ajax({
        url: '/wordcloud/'+nid,
        type: "GET",
        dataType: "json",
        success:function(data){
            if(data['notgh'].length>0)
                $(wordCloudMaker(data['notgh'],'notghwc'));

            if(data['tazakor'].length>0)
                $(wordCloudMaker(data['tazakor'],'tazakorwc'));
            if(data['tarh'].length>0)
                $(wordCloudMaker(data['tarh'],'tarhwc'));

            $("a[href='#notgh']").on("click",function(){
                if(data['notgh'].length>0)
                    $(wordCloudMaker(data['notgh'],'notghwc'));
            });

            $("a[href='#tazakor']").click(function(){
                if(data['tazakor'].length>0)
                    $(wordCloudMaker(data['tazakor'],'tazakorwc'));
            });

            $("a[href='#tarh']").click(function(){
                if(data['tarh'].length>0)
                    $(wordCloudMaker(data['tarh'],'tarhwc'));
            });
        },
        cache: true,
    });
}

$('a[href=#notgh]').on('click',function(){
    window.location.hash='notgh';
});
$('a[href=#huzurghiab]').on('click',function(){
    window.location.hash='huzurghiab';
});
$('a[href=#mosharekat]').on('click',function(){
    window.location.hash='mosharekat';
});
$('a[href=#tazakor]').on('click',function(){
    window.location.hash='tazakor';
});
$('a[href=#rahyabi]').on('click',function(){
    window.location.hash='rahyabi';
});
$('a[href=#soal]').on('click',function(){
    window.location.hash='soal';
});