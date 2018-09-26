var vectorize;
(function (){

  function norm(a){
    let sqrsum = 0;
    for (let i = 0; i < a.length; ++i){
      sqrsum += a[i]*a[i];
    }
    return Math.sqrt(sqrsum);
  }

  function normL1(a){
   let abssum = 0;
    for (let i = 0; i < a.length; ++i){
      abssum += Math.abs(a[i]);
    }
    return abssum; 
  }

  function add(a, b){
    let c = [];
    for (let i = 0; i < a.length; ++i){
      c.push(a[i] + b[i]);
    }
    return c;
  }

  function sub(a, b){
    let c = [];
    for (let i = 0; i < a.length; ++i){
      c.push(a[i] - b[i]);
    }
    return c;
  }

  function cross(a, b){
    return [a[1]*b[2] -  a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
  }

  function dot(a, b){
    let i = 0;
    let sumprod = 0;
    for (let i = 0; i < a.length; ++i){
      sumprod += a[i]*b[i];
    }
    return sumprod;
  }

  vectorize = {
    norm,
    normL1,
    add,
    sub,
    cross,
    dot
  }
})();

  
