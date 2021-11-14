const canvas = document.getElementById('canvas1');
canvas.width=window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let particles=[];
let hue=0;

let mouse = {
    x:null,
    y:null
}

function updateTextInput(val,id) {
    document.getElementById(id).innerText=val; 
  }