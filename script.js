
let showMenu=false;
/**
 * handles the update of all elements in global particles variable. Runs each animation frame.
 * updates collision coordinates for particle system
 */
function updateAllParticles(){
    //set increment based on particle limit
    let increment=0;
    let count=particles.length-formData.particleLimit
    if(count>0){
        increment=1;
    }
    //increment or clear collision offset based off showMenu. cap at menu width. creates an sliding collision barrier
    collisionOffset = Math.min(showMenu ? collisionOffset+20:0,menu.offsetWidth)
    for(let i=0;i<particles.length;i++){
        const particle = particles[i]
        particle.update();
        particle.age+=increment;
        if(particle.age >=formData.particleLimit/2 && count>0) {
            particle.growthFactor= ()=> -.1;
            count--;
        }
        else particle.growthFactor=()=>formData.growth;
        if(particle.size <= 0){
            particles.splice(i,1);
            i--;
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