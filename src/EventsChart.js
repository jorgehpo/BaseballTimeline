function EventsChart() {
  let params = {
    width: 600,
    height: 500,
    tracking: null,
    margin:{
      left:40, right:100, top:10, bottom:40
    }
  };

  function my(selection) {
    let svg = selection.append("svg")
      .style("width", params.width)
      .style("height", params.height)

    let events = [];
    for (let i = 0; i < params.tracking.length; ++i){
      if (params.tracking[i]["event_name"] !== null 
        && params.tracking[i]["event_name"] !== "Top speed"){
        events.push({
          name: params.tracking[i]["event_name"],
          player: params.tracking[i]["event_player"],
          time: params.tracking[i]["time_elapsed_sec"]
        })
      }
    }

    let scaleX = d3.scaleLinear()
      .domain(d3.extent(params.tracking, d=>d.time_elapsed_sec))
      .range([params.margin.left, params.width - params.margin.right]);

    let axisBottom = d3.axisBottom(scaleX);
  
    svg.append("g")
      .attr("class","axisBottom")
      .attr("transform",
          "translate(0 ," + (params.height - params.margin.bottom) + ")")
      .call(axisBottom);


    let usedTextSpace = [-1];    

    svg.append("g")
      .attr("class", "events_g")
      .selectAll(".event")
      .data(events)
      .enter()
      .each(function(d,i) {
        let event = d3.select(this)
          .append("g")
          .attr("class", "event");

        let circle = event.append("circle")
          .attr("class", "event")
          .attr("cx", d=>scaleX(d.time))
          .attr("cy", 10)
          .attr("r", 3)
          .style("stroke", "gray");

        let text = event.append("text")
          .text(d => {
            if (d.player !== "null")
              return d.name + " (" + d.player + ")";
            else
              return d.name;
          });

        
        text.attr("x", d=>{return scaleX(d.time) + 5})
          .attr("y", d=>{
            let curEvent = scaleX(d.time);
            let bbox = text.node().getBBox();
            for (let i = 0; i < usedTextSpace.length; ++i){
              if (curEvent > usedTextSpace[i] + 15){
                usedTextSpace[i] = curEvent + bbox.width;
                circle.attr("cy", (i+1)*20);
                return (i+1)*20+5;
              }
            }
            usedTextSpace.push(curEvent + bbox.width);
            circle.attr("cy", (usedTextSpace.length)*20);
            return (usedTextSpace.length)*20 + 5;
          })
      })
      
      svg.append("text")
        .text("Time (s)")
        .attr("text-anchor", "middle")
        .attr("x", params.width/2)
        .attr("y", params.height - 10);
  }
  
  helpers.createGettersSetters(my, params);

  return my;
}