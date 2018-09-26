var constants;

(function (){
  constants = {
    colorScale: d=>{return{
      "BALL": "#555",
      "P": "#FFF",
      "C": "#a6cee3",
      "1B": "#1f78b4",
      "2B": "#b2df8a",
      "3B": "#33a02c",
      "SS": "#fb9a99",
      "LF": "#e31a1c",
      "CF": "#fdbf6f",
      "RF": "#ff7f00",
      "B": "#cab2d6",
      "R@1": "#6a3d9a",
      "R@2": "#ffff99",
      "R@3": "#b15928"
    }[d]},
    colorScale2: d=>{return{
      "BALL": "#555",
      "C": "#1f77b4",
      "P": "#aec7e8",
      "1B": "#ff7f0e",
      "2B": "#ffbb78",
      "3B": "#2ca02c",
      "SS": "#98df8a",
      "LF": "#d62728",
      "CF": "#ff9896",
      "RF": "#9467bd",
      "B":  "#c5b0d5",
      "R@1":"#8c564b",
      "R@2":"#c49c94",
      "R@3":"#e377c2",
    }[d]},
    /*
    blue
    ["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", 
    orange
    "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", 
    green
    "#31a354", "#74c476", "#a1d99b", "#c7e9c0", 
    pink
    "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb", 
    gray
    "#636363", "#969696", "#bdbdbd", "#d9d9d9"]
    */
    colorScaleOrganized: d=>{return{ 
      "BALL": "#555",
      "C": "#756bb1",
      "P": "#fb8d46",
      "SS": "#e6550d",
      "1B": "#fdd0a2",
      "2B": "#fdae6b",
      "3B": "#fd8d3c",
      "LF": "#31a354",
      "CF": "#74c476",
      "RF": "#a1d99b",
      "B":  "#3683bb",
      "R@1":"#6dafd4",
      "R@2":"#9fcae0",
      "R@3":"#c7dbee",
    }[d]},
    gameElementsForColor: ["R@1", "R@2", "R@3", "1B", "2B", "3B", "SS", "LF", "CF", "RF", 
      "B", "BALL", "C"],
  	gameElements: ["B", "R@1", "R@2", "R@3", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "C",
  		 "BALL"],
  	movingGameElements: ["C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", 
  		"B", "R@1", "R@2", "R@3"],
    ballpark:{
      'base1': [61, 66],
      'base2': [0.0, 127.2792206],
      'base3': [-61, 66],
      'pitcherMound': [0, 65],
      'homePlate': [0, 0]
    }
  };
})();