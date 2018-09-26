 function LineChart() {
  let params = {
    width: 500,
    height: 500,
    data: null,
    xAccessor: null,
    yAccessor: null,
    xLabel: null,
    yLabel: null,
    events: null,
    xDomain: null,
    yDomain: null,
    scaleX: null,
    scaleY: null,
    margin:null,
    annotations:null,
    colorScale:null
  };

  function my(selection) {
    // Creating svg element with fixed viewbox
    let svg = selection;

    svg.append("style")
      .text(".tick line{opacity: 0.5; stroke-dasharray: 5 5; } .baseAnnotations line{opacity: 0.5; stroke: black; stroke-dasharray: 5 5; }")

    let scaleX, scaleY;
    if (!params.scaleX){
      scaleX = d3.scaleLinear()
        .domain(params.xDomain)
        .range([params.margin.left, params.width - params.margin.right]);
    }else{
      scaleX = params.scaleX;
    }
    if (!params.scaleY){
      scaleY = d3.scaleLinear()
        .domain(params.yDomain)
        .range([params.height - params.margin.bottom, params.margin.top]);
    }else{
      scaleY = params.scaleY;
    }
    let line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return scaleX(params.xAccessor(d)); })
      .y(function(d) { return scaleY(params.yAccessor(d)); });

    // Adding BaseAnnotations labels
    svg.selectAll(".baseAnnotations")
      .data(params.annotations)
      .enter()
      .each(function(d, i){
        let sel = d3.select(this).append("g").classed("baseAnnotations",true);
        sel.append("line")
          .attr("x1", 0)
          .attr("x2", params.width)
          .attr("y1", d=>scaleY(params.yAccessor(d)))
          .attr("y2", d=>scaleY(params.yAccessor(d)));

          sel.append("text")
          .attr("x", params.width-params.margin.right + 5)
          .attr("y", d=>scaleY(params.yAccessor(d))-5)
          .text(d=>d.name);
      });


    svg.selectAll(".elementLine")
      .data(params.data)
      .enter()
      .append("g")
      .attr("class", "elementLine")
      .append("path")
      .attr("d", d=>line(d.positions))
      .style("stroke", d=>params.colorScale(d.id))
      .style("stroke-width",5)
      .style("stroke-linecap","round")
      .style("fill", "transparent");


    let axisBottom = d3.axisBottom(scaleX).tickSizeInner(-params.height).tickSizeOuter(3);
;
    
    svg.append("g")
      .attr("class","axisBottom")
      .attr("transform",
          "translate(0 ," + (params.height - params.margin.bottom) + ")")
      .call(axisBottom);

    svg.append("text")
        .text(params.xLabel)
        .attr("text-anchor", "middle")
        .attr("x", params.margin.left + (params.width-params.margin.right-params.margin.left)/2)
        .attr("y", params.height - 10);

    svg.append("text")
        .text(params.yLabel)
        .attr("text-anchor", "left")
        .style("writing-mode", "tb")
        .attr("x", 5)
        .attr("y", 10);


    let existingEvents = Object.create(null)
    // Adding annotations to events
    svg.selectAll(".eventAnnotation")
      .data(params.events)
      .enter()
      .each(function (d, i){
        

        let sel = d3.select(this).append("g").classed("eventAnnotation",true)
          .attr("transform", "translate(" + scaleX(d.x) + "," + scaleY(d.y) + ")");

        sel.append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", 10)
          .style("fill", d=>params.colorScale(d.player));

        if (d.event_name.indexOf("Player reached") > -1){
          existingEvents["REACHED_BASE"] = true;
          sel.append("rect")
            .attr("x", -5)
            .attr("y", -5)
            .attr("width", 10)
            .attr("transform", "rotate(45)")
            .attr("height", 10)
            .style("stroke", "#555")
            .style("fill", "#FFF");  
          }else if (d.event_name === "Tag was applied"){
            existingEvents["TAG_APPLIED"] = true;
            sel.append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 3)
              .style("stroke", "#555")
              .style("fill", "#FFF");
          }
        
      })
      

    let playerAnnotations = [];
    for (let i = 0; i < params.data.length; ++i){
      if (params.data[i].annotate){
        playerAnnotations.push({
          id:params.data[i].id,
          x:scaleX(params.xAccessor(params.data[i].positions[0])),
          y:scaleY(params.yAccessor(params.data[i].positions[0])) + 10
        })
      }
    }

    svg.selectAll(".PlayerAnnotations")
      .data(playerAnnotations)
      .enter()
      .append("text")
      .attr("class", "PlayerAnnotations")
      .attr("x", d=>d.x)
      .attr("y", d=>d.y)
      .text(d=>d.id)
      .call(d3.drag().on("start", function(){
        var txt = d3.select(this);
        d3.event.on("drag", dragged).on("end", ended);
        function dragged(d) {
          txt.attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
        }
        function ended() {
        }
      }));





  }
  


  helpers.createGettersSetters(my, params);

  return my;
}