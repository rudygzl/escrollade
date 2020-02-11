

// oiseau
export function fly(){
    var bird = document.getElementById("bird");
    var x = 0;
    var y = 0;
    var id = setInterval(frame, 5);
    function frame() {
        
      x++;
      bird.style.left = x + "px";
      y += .1;
      bird.style.top = y + "px";
      if (x == 1800){
        clearInterval(id)
      }
  
    }
  }
  
  fly()

  export function fly1(){
    var bird = document.getElementById("bird1");
    var x = 0;
    var y = 80;
    var id = setInterval(frame, 5);
    function frame() {
        
      x++;
      bird.style.left = x + "px";
      y += .1;
      bird.style.top = y + "px";
      if (x == 1800){
        clearInterval(id)
      }
  
    }
  }
  
  fly1()

  export function fly2(){
    var bird = document.getElementById("bird2");
    var x = 80;
    var y = 80;
    var id = setInterval(frame, 5);
    function frame() {
        
      x++;
      bird.style.left = x + "px";
      y += .1;
      bird.style.top = y + "px";
      if (x == 1800){
        clearInterval(id)
      }
  
    }
  }
  
  fly2()

  export function fly3(){
    var bird = document.getElementById("bird3");
    var x = 40;
    var y = 40;
    var id = setInterval(frame, 5);
    function frame() {
        
      x++;
      bird.style.left = x + "px";
      y += .1;
      bird.style.top = y + "px";
      if (x == 1800){
        clearInterval(id)
      }
  
    }
  }
  
  fly3()

 