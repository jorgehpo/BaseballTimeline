function BaseballSchema() {
  let params = {
    width: 500,
    height: 500,
    tracking: null,
    fieldSVG: null,
    gameElements: null,
    colorScale:null
  };

  const input2ndBase = [0.0, 127.2792206],
  outputHomePlate = [125.2, 203.5],
  output2ndBase = [125.2, 150.8],
  inputScale = 1.0 / input2ndBase[1],
  outputScale = 1.0 / (output2ndBase[1] - outputHomePlate[1]);

  function scaleX(x){
    return (((-x) * inputScale) / outputScale) + outputHomePlate[0];
  }

  function scaleY(y){
    return (y * inputScale) / outputScale + outputHomePlate[1];
  }

  function my(selection) {
    let colorScale = params.colorScale;
    let gameElements = params.gameElements;
    let line = d3.line()
      .x(function(d) { return scaleX(d.x); })
      .y(function(d) { return scaleY(d.y); });

    // Creating svg element with fixed viewbox
    let svg = selection.append("svg")
      .attr("viewBox","0 0 250 250") // 0 0 250 250
      .style("width", params.width)
      .style("height", params.height);
    svg.append("g").style("opacity", 0.8).html(params.fieldSVG);

    // Processing the input data. 
    let rawTracking = params.tracking;
    // tracking: map<element>: array<Object<x,y>>
    let tracking = Object.create(null);
    gameElements.forEach(element => {
      tracking[element] = [];
      for (let i = 0; i < rawTracking.length; ++i){
        if (rawTracking[i][element+"_x"] !== null) {
          tracking[element].push({
            x: rawTracking[i][element+"_x"],
            y: rawTracking[i][element+"_y"]
          });
        }
      }
    });

    // orderedTracking: array of pairs {id, positions}, in the order they are rendered
    orderedTracking = gameElements.map(element=>{
        if (tracking[element].length > 0){
          return {
            id: element,
            positions: tracking[element]
          }
        }else{
          return null;
        }
    }).filter(x=>x!==null);

    // Adding tracking marks container
    let trackingMarks = svg.selectAll(".trackingMarks").data(orderedTracking).enter();

    trackingMarks.each(function(d, i){
      let sel = d3.select(this).append("g").classed("trackingMarks",true);
      // Adding line paths
      let elementPaths = sel.append("path")
        .attr("d", d=>line(d.positions))
        .style("stroke", d=>colorScale(d.id))
        .style("stroke-width",1.5)
        .style("stroke-dasharray", d=>(d.id === "BALL"? "3 3": "0"))
        .style("fill", "transparent");
      
      // Adding circles at the beginning at the line
      let startCircles = sel.append("circle")
        .attr("cx", d=>scaleX(d.positions[0].x))
        .attr("cy", d=>scaleY(d.positions[0].y))
        .attr("r", 1.5)
        .style("fill", d=>colorScale(d.id));

      // Adding circles at the end of the line
      let endCircles = sel.append("circle")
        .attr("cx", d=>scaleX(d.positions[d.positions.length-1].x))
        .attr("cy", d=>scaleY(d.positions[d.positions.length-1].y))
        .attr("r", 2.5)
        .style("fill", d=>colorScale(d.id));
        
      /*let textPlayer = sel.append("text")
        .attr("x", d=>scaleX(d.positions[d.positions.length-1].x))
        .attr("y", d=>scaleY(d.positions[d.positions.length-1].y-2))
        .text(d=>d.id)
        .style("fill", "white")
        .style("text-anchor", "middle")
        .style("font-size",3)*/

      /*svg.append("circle").attr("cx", scaleX(constants.ballpark.homePlate[0]))
      .attr("cy", scaleY(constants.ballpark.homePlate[1] + 10))
      .attr("r", 1)
      .attr("fill", "black")*/
        
    }); // trackingMarks.each ...
  }
  
  helpers.createGettersSetters(my, params);

  return my;
}