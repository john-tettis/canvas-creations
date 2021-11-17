//canvas 1 for particles
const canvas = document.getElementById('canvas1');
//canvas 2 for firing context and bomb
const canvas2 = document.getElementById('canvas2');
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


let particles=[];
let hue=0;

let mouse = {
    x:null,
    y:null
}
//used for range inputs to update their individual <p> displays
function updateTextInput(val,id) {
    document.getElementById(id).innerText=val; 
  }

//Navbar Color Update
//select navbar items
let logo = document.getElementsByClassName('logo')[0]
let settings = document.getElementsByClassName('settings')[0]
//update navbar items colors
let a = document.getElementsByClassName('hue-link')
console.log(a)
const updateAppBar=()=>{
    logo.style.color = `hsl(${hue}, 100%, 50%)`
    settings.style.color = `hsl(${hue-180}, 100%, 50%)`
    //increment global hue
    for(let el of a){
        el.style.color=`hsl(${hue}, 100%, 50%)`;
    }
    hue++;
}