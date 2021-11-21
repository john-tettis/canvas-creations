//canvas 1 for particles
const canvas = document.getElementById('canvas1');
//canvas 2 for firing context and bomb
const canvas2 = document.getElementById('canvas2');
//offset to be used by particles to collide when menu is opened. Easier solution rather than ressizing the canvas.
let collisionOffset=0;
let ctx;
let ctx2;
//update widths/heights
if(canvas &&canvas2){
    canvas.width=window.innerWidth;
    canvas.height = window.innerHeight;
    canvas2.width=window.innerWidth;
    canvas2.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    ctx2 = canvas2.getContext('2d');
}

//global particles variable
let particles=[];
let hue=0;

let mouse = {
    x:null,
    y:null
}
/**
 * used for range inputs to update their individual <p> displays
 **/
function updateTextInput(val,id) {
    document.getElementById(id).innerText=val; 
  }



//Navbar Color Update

//select navbar items that need color update
let logo = document.getElementsByClassName('logo')[0]
let settings = document.getElementsByClassName('settings')[0]
console.log(settings)
//update navbar items colors

//select all links marked for color changing effet
let a = document.getElementsByClassName('hue-link')
/**
 * update all elements that need a color update each frame.
 */
const updateColoredElements=()=>{
    logo.style.color = `hsl(${hue}, 100%, 50%)`
    settings.style.color = `hsl(${hue}, 100%, 50%)`
    //loop through all links and updatge their color
    for(let el of a){
        el.style.color=`hsl(${hue}, 100%, 50%)`;
    }
    //increment hue
    hue++;
}


