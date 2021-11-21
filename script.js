

/**
 * handles the update of all elements in global particles variable. Runs each animation frame.
 */
function updateAllParticles(){
    for(let i=0;i<particles.length;i++){
        particles[i].update();
        if(particles[i].size <= 0){
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
    //set fillstyle to 
    ctx.fillStyle='rgba(0,0,0,.03)';
    
    //if formData.trails, draw opaque rectangle to slowly cover previous particle drawings, creating trail effect
    if(formData.trails)ctx.rect(0,0,canvas.width,canvas.height);
    //otherwise clear the entire canvas
    else ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fill();
    //canvas two gets cleared each frame;
    ctx2.beginPath()
    ctx2.clearRect(0,0,canvas.width,canvas.height);
    ctx2.fill()
}

//this function is a reference to be assigned to a function used to update the hover color of an element. 
//Realistically anything could be assigned to hoverColor in order to add it to the update animation cycle.
let hoverColor =()=>null;

//animate function, recursively calls indefinetely
function animate(){
    updateCanvas();
    updateAllParticles();
    fireContext.update()
    
    updateColoredElements()
    //efect any elements needing a color update
    hoverColor();
    //update clearing animation
    clearingAnimator.update();
    window.requestAnimationFrame(animate)

}
animate();