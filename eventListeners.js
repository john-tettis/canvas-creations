window.addEventListener('resize',()=>{
    canvas.width=window.innerWidth;
    canvas.height = window.innerHeight;
    canvas2.width=window.innerWidth;
    canvas2.height = window.innerHeight;
})

canvas.addEventListener('touchstart',(e)=>{
    e.preventDefault();
    //if double touch, make mouse coordinates the mipoint of touches, start firing context
    if(e.touches.length===2){
        let x = (e.touches[0].clientX + e.touches[1].clientX)/2
        let y = (e.touches[0].clientY + e.touches[1].clientY)/2
        mouse={x,y}
        fireContext.start= mouse
    }
})

canvas.addEventListener('touchend',(e)=>{
    e.preventDefault();
    console.log(e)
    if(e.touches.length===1){
        fireContext.end={x:mouse.x,y:mouse.y}
    }
})
canvas.addEventListener('touchmove',(e)=>{
    e.preventDefault();
    let {touches}= e
    //dcalculate midpoint for double tap or anything more than.
    if(e.touches.length >=2) {
        let x = (touches[0].clientX + touches[1].clientX)/2
        let y = (touches[0].clientY + touches[1].clientY)/2
       mouse={x,y}
       return
    }
    mouse.x = touches[0].clientX
    mouse.y= touches[0].clientY
    for(let i=0;i<4;i++){
        particles.push(new Particle(hue,false,mouse.x,mouse.y))

    }
})
// canvas.addEventListener('click',()=>{
//     console.log('click')
//     particles.push(new ParticleSystem(50, 180, true))
// })

//add x,y values to fire context on mousedown
let click=false;
 canvas.addEventListener('mousedown',(e)=>{
     e.preventDefault()
     if(e.which===1) {
         //activate bomb or start spawning for a drag event. depends on user input
         if(formData.bomb){
             console.log('bomb')
             return particles.push(new Bomb({x:mouse.x,y:mouse.y, now:true}))

         }
         click=true;
        }
     if(e.which===3)return fireContext.start= {x:mouse.x,y:mouse.y};
    
})
//add x,y to context end, intitiating fire
canvas.addEventListener('mouseup',(e)=>{
    click=false;
    e.preventDefault()
    if(e.which===3)return fireContext.end= {x:mouse.x,y:mouse.y};

})

//adjust mouser coordinates and spawn particles if click is true
canvas.addEventListener('mousemove',(e)=>{
    
    mouse.x=e.x;
    mouse.y=e.y;
    if(!click)return
    for(let i=0;i<4;i++){
        
        particles.push(new Particle())

    }
})
   
//block right click menu 
  canvas.addEventListener('contextmenu', (e)=>e.preventDefault());
let showMenu=false;
//listen for settings icon press
settings.addEventListener('click',(e)=>{
    console.log(menu)
    showMenu = !showMenu;
    menu.style.display= showMenu ? 'flex':'none';
    about.style.display= showMenu ? 'inline':'none';
    

})


//canvas clearing functionality
const clear = document.getElementById('clear')
clear.addEventListener('mouseenter',()=>{
    hoverColor=()=>{
        clear.style.color=`hsl(${hue},100%,50%)`
    }
})
clear.addEventListener('mouseleave',()=>{
    clear.style.color=`white`
    hoverColor=()=>null;

})
const handleClear=()=>{
    clearingAnimator.clear()
}
clear.addEventListener('click',handleClear)


//about functionality
let aboutContent = document.getElementsByClassName('about-container')[0];
let settingsForm = document.getElementsByClassName('settings-form')[0]
let showAbout=false;
about.addEventListener('click',(e)=>{
    e.preventDefault()
    showAbout=!showAbout;
    aboutContent.style.display= showAbout ? 'flex':'none'
    settingsForm.style.display= !showAbout ? 'flex':'none'

})
