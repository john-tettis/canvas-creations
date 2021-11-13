const GRAVITY = .41;

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
let particles=[];
let blocks= [];
let hue=0;
canvas.width=window.innerWidth;
    canvas.height = window.innerHeight;

let mouse = {
    x:null,
    y:null
}
window.addEventListener('resize',()=>{
    canvas.width=window.innerWidth;
    canvas.height = window.innerHeight;
})
canvas.addEventListener('mousemove',(e)=>{
    mouse.x=e.x;
    mouse.y=e.y;
    // for(let i=0;i<10;i++){
        
    //     particles.push(new Particle())

    // }
})
// canvas.addEventListener('click',()=>{
//     console.log('click')
//     particles.push(new ParticleSystem(50, 180, true))
// })

//updates all particle systems and particles in the particl array. once per animation frame
function particleSystemHandler(){
    for(let i=0;i<particles.length;i++){
        particles[i].update();
        if(particles[i].toRemove || particles[i].size <= 0){
            particles.splice(i,1);
            i--;
        }
    }

}


class Firing{
    constructor(){
        this.start= {x:null,y:null}
    }
    update(){
        this.start={x:player.x,y:player.y}
        let {x,y} = this.start;
        if(!x || !y) return
        if(this.end){
           this.handleFire() 
        }
        else{
            
            ctx.beginPath()
            ctx.moveTo(x,y)
            ctx.strokeStyle =`hsl(${hue},100%,50%)`
            ctx.lineWidth=5;
            ctx.lineTo(mouse.x,mouse.y)
            ctx.stroke()
        }
    }
    handleFire(){
        let speed = 20;
        let dx = this.end.x-this.start.x;
        let dy = this.end.y-this.start.y;
        let ratio = Math.abs(dy/dx);
        ratio = ratio  > 7 ? 7:ratio < -7? -7: ratio;
        console.log({dx,dy, ratio})
        dx =speed*(dx > 0? 1:-1);
        dy = speed*ratio*(dy > 0? 1:-1);
        // console.log({dx,dy, ratio})
        let data={x:this.start.x,y:this.start.y, dx,dy}
        particles.push(new ParticleSystem(10,0,false,data,this.end.connected))
        this.start = {};
        this.end = undefined;
    }
}

let fireContext = new Firing()
//add x,y values to fire context on mousedown
let interval=null;
canvas.addEventListener('mousedown',()=>{
    fireContext.end = {x:mouse.x,y:mouse.y, connected:true};
    interval = setInterval(()=>{
        fireContext.end = {x:mouse.x,y:mouse.y, connected:false};
    },500)

})
canvas.addEventListener('mouseup',()=>{
    clearInterval(interval)
})
class Particle{
    constructor(color=hue,upwards,x=mouse.x, y=mouse.y, dx, dy){
        this.size = Math.random()* 6 + 6
        this.x = x;
        this.y=y;
        this.dx= dx || Math.random()*5-2.5;
        this.dy= dy || Math.random()*5-2.5;
        this.color = Math.random()*30 + color
        this.gravity = upwards ? -GRAVITY: GRAVITY
        // this.color= Math.random()*360
    }
    update(){
        this.x+=this.dx
        this.y+=this.dy
        this.dy+=this.gravity;
        this.size-=.05;
        if(this.y > canvas.height || this.y<0) this.dy = -this.dy*.5;
        if(this.x > canvas.width || this.x < 0) this.dx = -this.dx*.5;
        if(this.size>0)this.draw();
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle=`hsl(${this.color},100%,50%)`;
        ctx.arc(this.x,this.y, this.size, 0, Math.PI *2)
        ctx.fill();
    }
}

/**
 * 
 * @var quantity how many particles
 * @var offset color offset from hue variable incremented each frame
 * @var upwards reverse gravity ?
 * @var fd firing data = object passed by fire handler to change position and acceleration
 * @var connected connect the dots ?
 * 
 */
class ParticleSystem{
    constructor(quantity, offset=0, upwards=false, fd, connected){
        this.particles = [];
        this.origin ={x:mouse.x,y:mouse.y};
        this.toRemove=false;
        this.speed=-10;
        this.connected = connected;
        // this.drawTrail();
        if(fd){
            for(let i=0;i<=quantity;i++){
                fd.dx+=  (Math.random()*3 -1.5)
                fd.dy+=  (Math.random()*3 -1.5)
                this.particles.push(new Particle(hue-offset,upwards, fd.x,fd.y,fd.dx,fd.dy))
            }

        }
        else{
            for(let i=0;i<=quantity;i++){
                this.particles.push(new Particle(hue-offset,upwards))
            }
        }
    }
    update(){
        let every = true;
        for(let i=0;i<this.particles.length;i++){
            this.particles[i].update();
            if(this.particles[i].size>0){
                every=false;
            }
            if(this.particles[i].size<=0){
                this.particles.splice(i,1);
                i--;
            }
            
        }
        if(every){
            // ctx.beginPath();
            // ctx.fillStyle=`black`;
            // ctx.arc(this.origin.x,this.origin.y, 110, 0, Math.PI *2)
            // ctx.fill();
            this.toRemove=true;

        }
        if(!this.connected)return;
        for(let i=0;i<this.particles.length;i++){
            for(let j=i+1; j<this.particles.length;j++){
                let p1 = this.particles[i]
                let p2 = this.particles[j]
                p2.update();
                // console.log({particles,p1,p2,i,j})
                let dx = p1.x-p2.x;
                let dy = p1.y-p2.y
                let distance = Math.sqrt(dy**2 + dx**2)
                if(distance < 100){
                    ctx.beginPath();
                    ctx.strokeStyle =`hsl(${hue+180}, 100%,50%)`;
                    ctx.lineWidth ='2'
                    ctx.moveTo(p1.x,p1.y);
                    ctx.lineTo(p2.x,p2.y);
                    ctx.stroke();
                }
            }
        }
        // if all particles are done animating, cover them up
        
    }
}



class Player{
    constructor(x,y,hue,size=100){
        this.x=x;
        this.y=y;
        this.dx=0;
        this.dy=0;
        this.size=size,
        this.hue=hue;
        this.ddy=0;
        this.ddx=0;
        this.gravity = GRAVITY;
        this.collisionX = false;
        this.collisionY = false;
        this.update();
        
    }
    update(){
        // if(this.x < canvas.width - this.size && this.x > this.size/2) this.x+=this.dx;
        // else this.x = this.x > canvas.width ? this.x-5:this.x + 5;
        // if(this.y < canvas.height - this.size && this.y > this.size/2)this.y+=this.dy;
        // else this.y = this.y > canvas.height ? this.y-5:this.y + 5;
        this.x+=this.dx;
        this.y+=this.dy;
         //canvas bounds handler
        this.x= Math.min(Math.max(this.x,this.size/2),canvas.width-this.size/2)
        this.y= Math.min(Math.max(this.y,this.size/2),canvas.height-this.size/2)
        this.dy+= this.gravity
        this.dx+=this.ddx;
        //block bounds handler. gonna be messy at first.
        // calculate coordinate in the direction of motion, few pixels ahead
        // loop through blocks and check if violates boundarys of  any blocks;
        //if so, set dx, dy to 0;
        //getting the point of each corner of the players model
        let diff = this.size;
        let px1 = this.x-diff
        let px2 = this.x+diff
        let py1 = this.y-diff
        let py2 = this.y+diff
        // console.log({px1,px2,py1,py2})
        for(let block of blocks){
            //getting the points for the corners of each block
            let {x1,x2,y1,y2} = block
            //if the player is within the bounds of the block horizontally
            if(px2 >= x1 && px1 <=x2){
                this.dy=0
                this.dx=0;
            }
            //if the player is within the bounds of the block vertically
            if(py2 >=y2 && py1 <=y1){
                this.dy=0;
                // this.dx=0;
            }
        }

        if(this.dx >-.4 && this.dx <.4){
            this.ddx=0; 
            this.dx=0;
        }
        if(this.dy >-.4 && this.dy <.4){
            this.ddy=0;
            this.dy=0
        }
       
        
        this.draw();
    }
    draw(){
        let icon = new Image();
        icon.src='./sacred.svg'
        ctx.beginPath();
        ctx.filter= `invert(77%) sepia(54%) saturate(516%) hue-rotate(100deg) brightness(99%) contrast(94%);`
        ctx.drawImage(icon, this.x-(this.size/2),this.y-(this.size/2),this.size,this.size);
        ctx.filter= '';
        ctx.fillStyle=`hsl(${hue},100%,50%)`;
        ctx.arc(this.x,this.y, 10, 0, Math.PI *2)
        ctx.fill();
    }
    increment(code,speed=6,ddy){
        // console.log(code)
        switch(code){
            case 'Space':
                this.dy=-speed;
                this.dy = this.dy < -10 ? -10:this.dy;
                this.ddy=ddy
                break
            case 'KeyA':
                this.dx=-speed;
                this.dx = this.dx < -10 ? -10:this.dx;
                this.ddx=ddy
                break
            case 'KeyS':
                this.dy=speed;
                this.dy = this.dy> 10 ? 10:this.dy;
                this.ddy=-ddy
                break
            case 'KeyD':
                this.dx=speed;
                this.dx = this.dx> 10 ? 10:this.dx;
                this.ddx=-ddy;
                break
            case 'Space':
        }
    }
}
let player = new Player(100,100,327);
window.addEventListener('keydown',(e)=>{
    if(e.code==='Space' && e.repeat) return;
    player.increment(e.code,100,0)
})
window.addEventListener('keyup',(e)=>{
    player.increment(e.code,0,.2)
})
class Block{
    constructor(x,y,width=200,height=50){
        this.x1=x;
        this.y1=y;
        this.x2= x+width;
        this.y2= y + height
        this.width=width;
        this.height=height;
        console.log({x1:this.x1,x2:this.x2,y1:this.y1,y2:this.y2})
        this.draw()
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle=`hsl(${hue},100%,50%)`;
        ctx.rect(this.x1,this.y1,this.width,this.height)
        ctx.fill();
    }

}
blocks.push(new Block(canvas.width-80,canvas.height*2/3))
blocks.push(new Block(300, 300))
function blockDraw(){
    for(let block of blocks){
        block.draw()
    }
}













function animate2(){
    particleSystemHandler();
    window.requestAnimationFrame(animate)

}
function animate(){
    //clear canvas
    ctx.beginPath()
    ctx.fillStyle='rgba(0,0,0,.03)';
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fill()
//update paritcles, firing context, block
    particleSystemHandler();
    fireContext.update()
    player.update();
    blockDraw()
    hue++;
    
    //recursively loop for next frame
    window.requestAnimationFrame(animate)

}
animate();