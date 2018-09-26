function main(){  
  let path = window.location.href.substr(window.location.href.indexOf("path=")+5);

  function createColorScale(){
    let scale = d3.schemeCategory20;
    scale.splice(14,2);
    scale.splice(1,1);
    let sorted = [];
    for (let i = 0; i < scale.length; i+=2){
      sorted.push(scale[i]);
    }
    for (let i = 1; i < scale.length; i+=2){
      sorted.push(scale[i]);
    }
    sorted[7]="#9d318f"
    let originalScale = d3.scaleOrdinal(sorted);
    let myScale = (d)=>{
      if (d === "BALL"){
        return "#555";
      }else{
        return originalScale(d);
      }
    }
    return myScale;
  }

  $.post(
      '/get_data',
      {
        path
      },
      function(data){
        let marginTimeline = {
          left:10, right:100, top:10, bottom:40
        };
        let allGameElements = constants.gameElements;
        let movingGameElements = constants.movingGameElements;
        let colorScale = constants.colorScaleOrganized;
        //let colorScale = d3.scaleOrdinal(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]);
        data = JSON.parse(data);
        let tracking = JSON.parse(data["tracking"]);
        let metadata = JSON.parse(data["metadata"])[0]; // metadata is an array of 1 element (pandas dataframe)
        let fieldSVG = data["svg_field"];
        let baseballSVG = data["svg_baseball"]

        let svgDim = {width:1200, height:450};
        let ballparkDim = {width:400, height:400};
        let timelineDim = {x:500, y:100, width:700, height:350};

        let svg = d3.select("body").append("svg").style("width", svgDim.width).style("height", svgDim.height);
        constants.gameElementsForColor.forEach(d=>{colorScale(d)})
        // adding the ball svg
        svg.append("g")
          .attr("transform", "translate("+(timelineDim.x-40)+","+20+")")
          .html(baseballSVG);

        // creating baseball schema visualization
        let baseballSchema = BaseballSchema()
          .width(ballparkDim.width)
          .height(ballparkDim.height)
          .tracking(tracking)
          .gameElements(allGameElements)
          .colorScale(colorScale)
          .fieldSVG(fieldSVG);

        let baseballTimeline = BaseballTimeline()
          .width(timelineDim.width)
          .height(timelineDim.height)
          .margin(marginTimeline)
          .tracking(tracking)
          .gameElements(movingGameElements)
          .colorScale(colorScale);

        svg.append("g")
          .attr("transform", "translate("+timelineDim.x+","+timelineDim.y+")")
          .call(baseballTimeline);

        svg.append("g")
          .attr("transform", "translate(-350,0)")
          .call(baseballSchema);

        let ballStatus = BallStatus()
          .width(timelineDim.width)
          .height(20)
          .margin(marginTimeline)
          .data(tracking)
          .colorScale(colorScale);

        svg.append("g")
          .attr("transform", "translate("+timelineDim.x+","+30+")")
          .call(ballStatus);

        // Adding legends
        let legendDiv = d3.select("body").append("div").style("margin-top","10px").attr("class", "legend");
        let topLegendDiv = legendDiv.append("div");
        let bottomLegendDiv = legendDiv.append("div").style("margin-top", "10px");
        let legend = topLegendDiv.selectAll("div").data(allGameElements);

        legend.enter().each(function(d, i){
          let sel = d3.select(this).append("div").style("display", "inline-block").style("margin-right","10px");
          sel.append("div")
            .style("width", "13")
            .style("height", "13px")
            .style("background-color", colorScale)
            .style("float", "left")
            .style("margin-right", "3px")
            .style("border-radius", "20px");

          sel.append("text").text(d);
        });

        

        /*let lSavedBase = bottomLegendDiv.append("div").style("display", "inline-block").style("margin-right","10px");
        lSavedBase.append("div").html("&#9672;").style("float", "left")
            .style("margin-right", "3px")
            .style("border-radius", "20px");
        lSavedBase.append("text").text("Player saved base")*/

        let lReachedBase = bottomLegendDiv.append("div").style("display", "inline-block").style("margin-right","10px");
        lReachedBase.append("div").html("&#x20DF;").style("float", "left")
            .style("margin-right", "3px")
            .style("border-radius", "20px");
        lReachedBase.append("text").text("Player saved base")

        let lTagged = bottomLegendDiv.append("div").style("display", "inline-block").style("margin-right","10px");
        lTagged.append("div").html("&#x25CB;").style("float", "left")
            .style("margin-right", "3px")
            .style("border-radius", "20px");
        lTagged.append("text").text("Tag was applied")

      });

}