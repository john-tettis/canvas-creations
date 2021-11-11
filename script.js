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
        let speed = 10;
        let dx = this.end.x-this.start.x;
        let dy = this.end.y-this.start.y;
        let ratio = Math.abs(dy/dx);
        ratio = ratio  > 7 ? 7:ratio < -7? -7: ratio;
        console.log({dx,dy, ratio})
        dx =speed*(dx > 0? 1:-1);
        dy = speed*ratio*(dy > 0? 1:-1);
        console.log({dx,dy, ratio})
        let data={x:this.start.x,y:this.start.y, dx,dy}
        particles.push(new ParticleSystem(50,0,false,data))
        this.start = {};
        this.end = undefined;
    }
}

let fireContext = new Firing()
//add x,y values to fire context on mousedown
canvas.addEventListener('click',()=>{
    fireContext.end = {x:mouse.x,y:mouse.y};

})
class Particle{
    constructor(color=hue,upwards,x=mouse.x, y=mouse.y, dx, dy){
        this.size = Math.random()* 6 + 6
        this.x = x;
        this.y=y;
        this.dx= dx || Math.random()*5-2.5;
        this.dy= dy || Math.random()*5-2.5;
        this.color = Math.random()*30 + color
        this.gravity = upwards ? -.2: .2
        // this.color= Math.random()*360
    }
    update(){
        this.x+=this.dx
        this.y+=this.dy
        this.dy+=this.gravity;
        this.size-=.05;
        if(this.y > canvas.height | this.y<0) this.dy = -this.dy*.5;
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
class ParticleSystem{
    constructor(quantity, offset=0, upwards=false, fd){
        this.particles = [];
        this.origin ={x:mouse.x,y:mouse.y};
        this.toRemove=false;
        this.speed=-10;
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
            // for(let j=i+1; i<this.particles.length;j++){
            //     let p1 = this.particles[i]
            //     let p2 = this.particles[j]
            //     let dx = p1.x-p2.x;
            //     let dy = p1.y-p2.y
            //     let distance = Math.sqrt(dy**2 + dx**2)
            //     if(distance < 10000){
            //         ctx.beginPath();
            //         ctx.strokeStyle =`hsl(${hue}, 100%,50%)`;
            //         ctx.moveTo(p1.x,p1.y);
            //         ctx.lineTo(p2.x,p2.y);
            //         ctx.stroke();
            //     }
            // }
            if(this.particles[i].size>0){
                every=false;
            }
            this.particles[i].update();
            if(this.particles[i].size<=0){
                this.particles.splice(i,1);
                i--;
            }
            
        }
        // if all particles are done animating, cover them up
        if(every){
            // ctx.beginPath();
            // ctx.fillStyle=`black`;
            // ctx.arc(this.origin.x,this.origin.y, 110, 0, Math.PI *2)
            // ctx.fill();
            this.toRemove=true;

        }
    }
}



class Player{
    constructor(x,y,hue,size=50){
        this.x=x;
        this.y=y;
        this.dx=0;
        this.dy=0;
        this.size=size,
        this.hue=hue;
        this.ddy=0;
        this.ddx=0;
        this.update();
        
    }
    update(){
        // if(this.x < canvas.width - this.size && this.x > this.size/2) this.x+=this.dx;
        // else this.x += this.x > canvas.width ? -5:5;
        // if(this.y < canvas.height - this.size && this.y > this.size/2)this.y+=this.dy;
        // else this.y += this.y > canvas.height ? -5:5;
        this.dy+= this.ddy;
        this.dx+=this.ddx;
        console.log(this.dx,this.dy)
        //decelarration handler
        if(this.dx >-1 && this.dx <1){
            this.ddx=0; 
            this.dx=0;
        }
        if(this.dy >-1 && this.dy <1){
            this.ddy=0;
            this.dy=0
        }
        //canvas bounds handler
        
        this.draw();
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle=`hsl(${hue},100%,50%)`;
        ctx.arc(this.x,this.y, this.size, 0, Math.PI *2)
        ctx.fill();
    }
    increment(code,speed=6,ddy){
        console.log(code)
        switch(code){
            case 'KeyW':
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
let player = new Player(80,80,327);
window.addEventListener('keydown',(e)=>{
    player.increment(e.code,10,0)
})
window.addEventListener('keyup',(e)=>{
    player.increment(e.code,0,.5)
})

function animate2(){
    particleSystemHandler();
    window.requestAnimationFrame(animate)

}
function animate(){
    ctx.beginPath()
    ctx.fillStyle='rgba(0,0,0,.03)';
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fill()
    particleSystemHandler();
    fireContext.update()
    player.update();
    hue++;
    window.requestAnimationFrame(animate)

}
animate();