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
        console.log('drawing')
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