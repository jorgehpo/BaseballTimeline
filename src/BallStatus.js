 function BallStatus() {
  let params = {
    width: 500,
    height: 500,
    data: null,
    margin:null,
    colorScale:null
  };

/*
        
*/

  function my(selection) {
    // Creating svg element with fixed viewbox
    let svg = selection;
    let rawTracking = params.data;
    let playerHasBall = [];
    
    let lastTimeSampled = rawTracking[rawTracking.length-1]["time_elapsed_sec"];
    let scaleX = d3.scaleLinear()
      .domain(d3.extent(rawTracking, d=>d['time_elapsed_sec']))
      .range([params.margin.left, params.width - params.margin.right]);

    let hitTime = -1, pitchTime = -1;
    for (let i = 0; i < rawTracking.length; ++i){
      if (rawTracking[i]["event_name"] === "Ball was caught" || rawTracking[i]["event_name"] === "Tag was applied" || rawTracking[i]["event_name"] == "Ball was released"){
        playerHasBall.push({
          player: rawTracking[i]["event_player"],
          event: rawTracking[i]["event_name"],
          time: rawTracking[i]["time_elapsed_sec"],
          x: scaleX(rawTracking[i]["time_elapsed_sec"]),
          y: -2
        })
      }
      if (rawTracking[i]["event_name"] == "Ball was hit"){
        hitTime = rawTracking[i]["time_elapsed_sec"];
      }
      if (rawTracking[i]["event_name"] == "Ball was pitched"){
        pitchTime = rawTracking[i]["time_elapsed_sec"];
      }
    }

    ballIntervals = [];
    for (let i = 0; i < playerHasBall.length-1; ++i){
      if (playerHasBall[i]["event"] == "Ball was released"){
        continue;
      }
      ballIntervals.push({
        startTime: playerHasBall[i]['time'],
        endTime: playerHasBall[i+1]['time'],
        player: playerHasBall[i]['player']
      })
    }

    if (hitTime > 0){
      let g = svg.append("g")
        .attr("transform", "translate(" + scaleX(hitTime) + ",0)");
      g.append("path")
        .attr("d", svgIcons.bat)
        .attr("transform", "scale(0.035) translate(0 ,30)" )
      g.append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", params.height)
        .style("stroke", "#000")
    }

    if (pitchTime > 0){
      let g = svg.append("g")
        .attr("transform", "translate(" + scaleX(pitchTime) + ",0)");
      g.append("circle")
        .attr("cx", 5)
        .attr("cy", 5)
        .attr("r", 2)

      g.append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", params.height)
        .style("stroke", "#000")
    }

    svg.selectAll(".border").data([1]).enter().append("rect")
      .attr("x", d=>scaleX(0))
      .attr("y", params.y)
      .attr("width", scaleX(lastTimeSampled) - scaleX(0))
      .attr("height", params.height)
      .style("fill", "none")
      .style("stroke", "#333");

    if (playerHasBall.length < 1) return; 


    if (playerHasBall[playerHasBall.length-1]["event"]=="Ball was caught" || playerHasBall[playerHasBall.length-1]["event"] == "Tag was applied"){
      ballIntervals.push({
        startTime: playerHasBall[playerHasBall.length-1]['time'],
        endTime: lastTimeSampled,
        player: playerHasBall[playerHasBall.length-1]['player']
      })
    }
    


    


    svg.selectAll(".ballIntervals").data(ballIntervals).enter()
      .append("rect")
      .attr("x", d=>scaleX(d.startTime))
      .attr("y", params.y)
      .attr("width", d=>scaleX(d.endTime) - scaleX(d.startTime))
      .attr("height", params.height)
      .style("fill", d=>params.colorScale(d.player))

    

    svg.selectAll(".playerAnnotation").data(playerHasBall)
      .enter()
      .append("text")
      .attr("x", d=>d.x)
      .attr("y", d=>d.y)
      .text(d=>d.event !== "Ball was released"?d.player:"")
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