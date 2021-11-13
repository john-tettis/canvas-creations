const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
let particles=[];
let hue=0;
canvas.width=window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
    x:null,
    y:null
}

const PARTICLE_LIMIT=100;