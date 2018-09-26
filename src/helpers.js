var helpers;
(function (){
	// Function that creates D3 style getters and setters for graph parameters

	function createGettersSetters(container, parameterDict){
		keys = Object.keys(parameterDict);
		for (let kid in keys){
			let key = keys[kid];
			container[key] = function(value){
				if (!arguments.length)
		      return parameterDict[key];
		    parameterDict[key] = value;
		    return container;
			}
		}
	}

  function argmax(array){
    let imax = 0;
    for (let j = 0; j < array.length; j++){
      if (array[j] > array[imax]){
        imax = j;
      }
    }
    return imax;
  }

	helpers = {
		createGettersSetters,
    argmax
	}
})();