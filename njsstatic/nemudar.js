    d3.csv("/Data/takhir.csv", function(data) {
        //load CSVfile here
        map = data.map(function(d) { return parseInt(d.mizan); });
        var formatCount = d3.format(",.0f");
        var margin = {top: 30, right: 0, bottom: 20, left: 10},
        width = 600 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

        ///inja range mehvare x ro taeenm
        var x = d3.scale.linear()
            .domain([0, 1700])
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

        var svg = d3.select("#totalhuzurplot").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg.append("text")
            .attr("x", (width / 2)-40)             
            .attr("y", 50 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("میزان تاخیر نمایندگان");

        svg.append("text")
            .attr("x", (width / 2)-50)             
            .attr("y", 70 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "13px") 
            .text("این نماینده در این دوره "+"#{namayadneDetails.mizanetakhir}"+"دقیقه تاخیر داشته است");
          
        svg.append("text")
           .attr("x", 250+(width / 2)-50)             
           .attr("y", 60 - (margin.top / 2))
           .attr('font-family', 'fa')
           .attr('font-size','70px' )
          .style("opacity",0.2)
           .text('\uf080'); 


        var bar = svg.selectAll(".bar")
            .data(data)
          .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

        var mizanetakhir=parseInt(#{namayadneDetails.mizanetakhir} )

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
                    return"#333"; 
                }
            })

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", -15)
            .attr("x", x(data[0].dx) / 2)
            .attr("text-anchor", "middle")
            .style("fill",function(d){
                if ((d.x<mizanetakhir&&mizanetakhir<d.x+d.dx)||(d.x==mizanetakhir))
                {
                    return "#FF9933";                
                }
                else
                {
                    return"#333"; 
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
    });

