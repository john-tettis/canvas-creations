
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
        let {x,y} = this.start;
        if(!x || !y) return
        if(this.end){
           this.handleFire() 
        }
        else{
            ctx.beginPath()
            ctx.moveTo(x,y)
            ctx.strokeStyle =`hsl(${hue},100%,50%)`
            ctx.lineTo(mouse.x,mouse.y)
            ctx.stroke()
        }
    }
    handleFire(){
        let dx = this.end.x-this.start.x;
        let dy = this.end.y-this.start.y;
        let speed = Math.max(-18, .05 * -Math.sqrt(dx**2 + dy**2));
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

class Particle{
    constructor(color=hue,upwards,x=mouse.x, y=mouse.y, dx, dy){
        this.size = Math.random()* 6 + 6
        this.x = x;
        this.y=y;
        this.dx= dx || Math.random()*5-2.5;
        this.dy= dy || Math.random()*5-2.5;
        this.color = Math.random()*30 + color
        this.gravity = ()=>formData.gravity;
        this.decreaseFactor = ()=>formData.decrease
        this.age=0;
    }
    update(){
        this.age++
        //if old enough, delete particle
        if(this.age >=PARTICLE_LIMIT) return this.size=0
        this.x+=this.dx
        this.y+=this.dy
        this.dy+=this.gravity();
        this.size-=this.decreaseFactor();
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
                fd.dx+=  (Math.random()*2 -1)
                fd.dy+=  (Math.random()*2 -1)
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
//navbar color update()
let logo = document.getElementsByClassName('logo')[0]
let settings = document.getElementsByClassName('settings')[0]

const updateAppBar=()=>{
    logo.style.color = `hsl(${hue}, 100%, 50%)`
    settings.style.color = `hsl(${hue-180}, 100%, 50%)`
}

function animate2(){
    particleSystemHandler();
    window.requestAnimationFrame(animate)

}
//using closure to bind variable inside funciton to be changed
let hoverColor =()=>null;
function animate(){
    //begin drawing
    ctx.beginPath()
    ctx.fillStyle='rgba(0,0,0,.03)';
    
    //handle animation depending on user settings
    // console.log(formData)
    if(formData.trails)ctx.rect(0,0,canvas.width,canvas.height);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fill();
    particleSystemHandler();
    fireContext.update()
    //update hover item
    hue++;
    //change colors in app bar
    updateAppBar()
    //efect any elements needing a color update
    hoverColor();
    //update clearing animation
    clearingAnimator.update();
    window.requestAnimationFrame(animate)

}
animate();





