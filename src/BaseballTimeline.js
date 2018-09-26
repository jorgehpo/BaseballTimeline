function BaseballTimeline() {
  let params = {
    width: 500,
    height: 500,
    tracking: null,
    fieldSVG: null,
    margin:{
      left:10, right:80, top:10, bottom:40
    },
    gameElements:null,
    colorScale:null
  };

  function my(selection) {

    let gameElements = params.gameElements;
    
    let rawTracking = params.tracking;
    let tracking = Object.create(null);

    let availableHeight = params.height - params.margin.top - params.margin.bottom;

    let scaleY = d3.scaleLinear()
      .domain([0, 2*Math.PI])
      .range([params.margin.top + availableHeight, params.margin.top]);

    let distMoundBase = vectorize.normL1(vectorize.sub(constants.ballpark.pitcherMound, constants.ballpark.homePlate));

    let events = [];

    let lastPosition;

    let playersLookForEvent =  new Set(["1B", "2B", "3B", "SS", "LF", "CF", "RF"]);

    gameElements.forEach(element => {
      tracking[element] = [[]];
      for (let i = 0; i < rawTracking.length; ++i){
        // Tracking
        if (rawTracking[i][element+"_x"] !== null){
          // Counterclockwise angle between two vectors
          // https://stackoverflow.com/questions/14066933/direct-way-of-computing-clockwise-angle-between-2-vectors
          // dot = x1*x2 + y1*y2      # dot product between [x1, y1] and [x2, y2]
          // det = x1*y2 - y1*x2      # determinant
          // angle = atan2(det, dot)  # atan2(y, x) or atan2(sin, cos)

          let pitcherMound = [0, 65];
          let homePlate = [0, 0];
          let elementPosition = [rawTracking[i][element+"_x"], rawTracking[i][element+"_y"]];
          let v1 = vectorize.sub(homePlate, pitcherMound)
          let v2 = vectorize.sub(elementPosition, pitcherMound);
          x1 = v1[0]; x2 = v2[0]; y1 = v1[1]; y2 = v2[1];
          let angle = Math.atan2(x1*y2-y1*x2, x1*x2 + y1*y2);
          if (angle < 0) 
            angle = 2*Math.PI + angle;
        

          // Player specific rules... I am aware this is bad
          if (element === "C" && vectorize.normL1(vectorize.sub(elementPosition, homePlate)) < 10)
            continue;

          if (element === "B" && angle > 2*Math.PI - Math.PI/10 && rawTracking[i]["time_elapsed_sec"] < 10){
            angle = 0;
          }

          if ((element === "B" || element.indexOf("R@") > -1) && rawTracking[i]["time_elapsed_sec"] > 7.5){
            if (angle < Math.PI/10){
              angle = 2*Math.PI;
            }
          }

          lastPosition = [rawTracking[i]["time_elapsed_sec"], angle];


          let radius = vectorize.normL1(v2);
          if (Math.abs(radius - distMoundBase) < 10){
            let curCurve = tracking[element][tracking[element].length-1];
            if (curCurve.length > 0 && Math.abs(scaleY(curCurve[curCurve.length-1]["angle"])-scaleY(angle)) > availableHeight/2){
              tracking[element].push([])
              curCurve = tracking[element][tracking[element].length-1];
            }
            /*let bases = ["base1"];
            if (playersLookForEvent.has(element)){
              for (let base_i = 0; base_i < bases.length; base_i++){
                if (vectorize.norm(vectorize.sub(constants.ballpark[bases[base_i]], elementPosition)) < 3) {
                  rawTracking[i]["event_name"] = "Player reached";
                  rawTracking[i]["event_player"] = element;
                }
              }  
            }*/
            curCurve.push({
              angle: angle,
              radius: radius,
              time:rawTracking[i]["time_elapsed_sec"]
            })
          }
        }

        // Events
        if (rawTracking[i]["event_name"] !== null && rawTracking[i]["event_player"] === element){
          if (rawTracking[i]["event_name"].indexOf("Player reached") > -1 || 
            rawTracking[i]["event_name"].indexOf("Tag was applied") > -1){
            events.push({
              x: lastPosition[0],
              y: lastPosition[1],
              event_name: rawTracking[i]["event_name"],
              player: rawTracking[i]["event_player"]
            })
          }
        }
      }
    });

    let line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return scaleX(d.time); })
      .y(function(d) { return scaleY(d.angle); });

    let orderedTracking = [];
    gameElements.forEach (element=>{
      tracking[element].forEach((curCurve, index) => {
        if (curCurve.length > 0){
          orderedTracking.push({
            id: element,
            positions: curCurve,
            annotate: index === 0
          });
        }else{
          return null;
        }
      })
    });

    orderedTracking.filter(x=>x!==null);

    let bases = [{name: 'Home Plate', angle: 0},
                 {name: '1st Base', angle: Math.PI/2},
                 {name: '2nd Base', angle: Math.PI},
                 {name: '3rd Base', angle: 3*Math.PI/2},
                 {name: 'Home Plate', angle: 2*Math.PI-1e-10} ]

    let lcAngle = LineChart()
      .width(params.width)
      .height(params.height)
      .data(orderedTracking)
      .events(events)
      .xAccessor(d=>d.time)
      .yAccessor(d=>d.angle)
      .margin(params.margin)
      .xLabel("Time (s)")
      .yLabel("")
      .xDomain(d3.extent(rawTracking, d=>d["time_elapsed_sec"]))
      .scaleY(scaleY)
      .colorScale(params.colorScale)
      .annotations(bases);

    selection.call(lcAngle);

  }
  
  helpers.createGettersSetters(my, params);

  return my;
}