
/** clears entire canvas. Less useful upon particle limit addition
 * 
 **/
class ClearingAnimation{
    constructor(x=canvas.width-80,y=canvas.height-80){
        this.x=x;
        this.y=y;
        this.size=10;
        this.animate = false;
        this.draw();
    }
    update(){
        if(this.animate){
            this.size+=20
            if(this.size> canvas.width && this.size>canvas.height) {
                particles.length=0;
                
            }
            if(this.size> canvas.width+10 && this.size>canvas.height+10) {
                return this.animate=false;
                
            }
            this.draw()
        }
      
        
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle=`hsl(${hue},100%,50%)`
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2)
        ctx.fill();
    }
    clear(){
        this.size=10;
        this.animate=true;
    }
}
let clearingAnimator = new ClearingAnimation()

//particle class -> tracks a single particle and its location and speed.
class Particle{
    constructor(color=hue,upwards,x=mouse.x, y=mouse.y, dx, dy){
        const offset = (Math.random() > .5 ? 180:0);
        this.size = Math.random()* 6 + 6
        this.x = x;
        this.y=y;
        this.dx= dx || Math.random()*5-2.5;
        this.dy= dy || Math.random()*5-2.5;
        this.color = (Math.random()*30 + color) + (formData.complementary ? offset:0);
        this.age=0;
        this.menuCollision=false;
    }
    //retreive friction from formdata
    friction=()=>formData.friction
    //retreive growth variable from form
    growthFactor = ()=>-formData.growth;
    //retreive gravity from form
    gravity = ()=>formData.gravity;
    //update function cjhanges position, size and acceleration of particle. runs each animation frame
    update(){
        this.x+=this.dx
        this.y+=this.dy
        this.dy+=this.gravity();
        this.size+=this.growthFactor();
        // if(this.size>20)this.decreaseFactor = ()=>formData.growth
        //friction handling. bring dx/dy to zero;
        this.dx+=this.dx<0 ? this.friction(): this.dx > 0 ? -this.friction():0;
        this.dy+=this.dy<0 ? this.friction(): this.dy > 0 ? -this.friction():0;

        //collision detection

        if(this.y > canvas.height-this.size){
            //calculate distance that particle has left the screen
            const bottom = this.y + this.size;
            const distance = bottom-canvas.height;
            //if the particle has left more .05 pixels, move it back towards the screen. 
            //keeps particles that move to far off the screen in between frames from becoming stuck.
            //this.dy would constantly flip because the particle was outside the bounds of the screen
            //but  could not move back on the screen before the next frame.
            if(distance<-.05)this.y-=distance
            this.dy = -this.dy*.6;
            }
        if(this.y<this.size){
            const distance= -(this.y - this.size);
            if(distance>.05)this.y+=distance
            this.dy = -this.dy*.6;

        }
        if(this.x > canvas.width-this.size) {
            this.menuCollision=false;
            const right = this.x + this.size;
            const distance = right-canvas.width
            this.x-=distance;
            this.dx= -this.dx*.6;
        }
        if(this.x <collisionOffset + this.size){
            if(this.menuCollision){
                this.x+=10;
                this.dx=Math.min(this.dx+2,15)
                if(this.x-this.size > collisionOffset) this.menuCollision=false;
            }
            else{
                this.menuCollision=true;
                const distance = -(this.x-this.size)+collisionOffset;
                this.x+=distance;
                this.dx=-this.dx*.6;
            }
            
                
        }
        if(this.size>0)this.draw();
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle=`hsl(${this.color},100%,50%)`;
        ctx.arc(this.x,this.y, this.size, 0, Math.PI *2)
        ctx.fill();
    }
}
//class particle SYstem -> handles multiple particles. Easy way to spawn many particles in one animation frame.
class ParticleSystem{
    constructor(quantity, offset=0, upwards=false, fd){
        this.particles = [];
        this.origin ={x:mouse.x,y:mouse.y};
        this.size=1;
        this.speed=-10;
        // this.drawTrail();
        //if particle system was created by firing context
        if(fd){
            //shoot particles in genereal direction provided by fd
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
            //this code will draw a line between all particles in a particel system, given they are close enough.
            //O(n^2) means thisn is extremely performance heavy.
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
            this.size=0;

        }
    }
}

//firing context to handle right click and drag firing sequence.
//Define fireContext.start to initiate tracking
//define fireContext.end to fire.
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
            //draw crosshair line on ctx2
            ctx2.beginPath()
            ctx2.moveTo(x,y)
            ctx2.strokeStyle =`hsl(${hue},100%,50%)`
            ctx2.lineTo(mouse.x,mouse.y)
            ctx2.stroke()
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
        let data={x:this.start.x,y:this.start.y, dx,dy, bomb:true}
        //check if we are shooting a notrmal shot or a bomb shot. bombs bounce before exploding.
        
        formData.bomb ? particles.push(new Bomb(data)):particles.push(new ParticleSystem(50,180,false,data))
        this.start = {};
        this.end = undefined;
    }
}
let fireContext = new Firing()

//spawns particle in direction, explodes into particle bomb upon second impact
class Bomb{
    constructor(data){
        this.x = data.x;
        this.y = data.y;
        this.collisions=0;
        this.age=0;
        this.color = hue
        
        
        //data.now is true only for left click events. no delay to firing
        if(data.now){
            this.size=.1;
            this.timer=0;
            this.dx=0;
            this.dy = 0;
            this.gravity = ()=>0;
            return
        }
        this.dx=data.dx;
        this.dy = data.dy;
        this.size=20;
        this.timer=80;
        this.gravity = ()=>formData.gravity;
    }
    update(){
        //check if bomb has exploded for a few seconds
        if(this.age >=formData.particleLimit) return this.size=0
        //increment x,y coordinates
        this.x+=this.dx
        this.y+=this.dy
        this.dy+=this.gravity();
        //collision detection -> invert direction
        if(this.y >= canvas.height-this.size || this.y<=this.size) {
            this.dy = -this.dy*.6;
            this.y+=this.dy
            this.collisions++
        }
        if(this.x >= canvas.width-this.size || this.x <= collisionOffset+this.size){ 
            this.dx = -this.dx*.6;
            this.x+=this.dx
            this.collisions++
        }
        // if the bomb has collided once or more, decrement timer
        if(this.collisions >=1){
            this.timer--
        }
        //after timer reaches zero, explode
        if(this.timer<=0) this.explode();
        //only draw if bomb has a positive size
        if(this.size>0)this.draw();
    
    }
    draw(){
        //random brightness creates flashing effect on bomb depending on collisions
        let brightness = Math.random()* (40 + this.collisions*30);
        ctx2.beginPath();
        ctx2.fillStyle=`hsl(${this.color},100%,${brightness}%)`;
        ctx2.arc(this.x,this.y, this.size, 0, Math.PI *2)
        ctx2.fill();
    }
    explode(){
        let v= formData.bomb_intensity
        let data={
            x:this.x,
            y:this.y, 
            dx:Math.random()*2*v-v, 
            dy:Math.random()*2*v-v
        };
        this.age++
        particles.push(new ParticleSystem(10,hue-this.color,false,data))
        this.size=.1;
        this.collisions=0; 
    }
}