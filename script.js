

//particle/particleSYstem handler. Runs each animation frame.
function particleSystemHandler(){
    
    for(let i=0;i<particles.length;i++){
        particles[i].update();
        if(particles[i].toRemove || particles[i].size <= 0){
            particles.splice(i,1);
            i--;
        }
    }

}
//updates canvas elements according to user settings. Ran each animation frame
function canvasUpdate(){
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
//Realistically ant=ything ca=ould be assigned to hoverColor in order to add it to the update animation cycle.
let hoverColor =()=>null;

//animate function, recursively calls indefinetely
function animate(){
    //begin drawing
    ctx.beginPath()
    ctx.fillStyle='rgba(0,0,0,.03)';
    
    canvasUpdate();
    particleSystemHandler();
    fireContext.update()
    
    //change colors in app bar
    updateAppBar()
    //efect any elements needing a color update
    hoverColor();
    //update clearing animation
    clearingAnimator.update();
    window.requestAnimationFrame(animate)

}
animate();