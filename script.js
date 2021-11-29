
let showMenu=false;
/**
 * handles the update of all elements in global particles variable. Runs each animation frame.
 * updates collision coordinates for pparticles, bombs, particle systems
 */
function updateAllParticles(){
    //set increment based on particle limit
    let increment=0;
    let count=particles.length-formData.particleLimit/2
    if(count>0){
        increment=1;
    }
    
     //decide whther to update collision barrier based on screen width and menu visibility
    const updateCollisionBarrier= showMenu&&window.innerWidth<776
    
    //increment or clear collision offset based off updateCollisionBarrier. cap at menu width. creates a sliding collision barrier
    collisionOffset = Math.min(updateCollisionBarrier ? collisionOffset+20:0,menu.offsetWidth)
    
    for(let i=0;i<particles.length;i++){
        const particle = particles[i]
        particle.update();
        if(particle.size <= 0){
            particles.splice(i,1);
            i--;
            continue
        }
        //only for individual particles
        if(!(particle instanceof Particle))continue
        particle.age+=increment;
        if(particle.age >=formData.particleLimit/2 && count>0) {
            particle.growthFactor= ()=> -.1;
            count--;
        }
       
    }

}


/**
 * clears the canvas according to user settings. Either clears entire frame, or draws semi-transparent rectangle across screen.
 *  Ran each animation frame
 **/
function updateCanvas(){
    //begin drawing
    ctx.beginPath()
    //set fillstyle to clear entire canvas
    ctx.fillStyle='rgba(0,0,0,225)';
    
    //if formData.trails,change fillstyle slowly cover previous particle drawings, creating trail effect
    if(formData.trails)ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    //otherwise clear the entire canvas
    // else ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.fill();
    //canvas two gets cleared each frame;
    ctx2.beginPath()
    ctx2.clearRect(0,0,canvas.width,canvas.height);
    ctx2.fill()
}

//animate function, recursively calls indefinetely
function animate(){
    updateCanvas();
    updateAllParticles();
    fireContext.update()
    
    updateColoredElements()
    //update clearing animation
    clearingAnimator.update();
    window.requestAnimationFrame(animate)

}
animate();
