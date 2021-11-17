let formData= {
    trails:false,
    gravity:.2, 
    decrease:0, 
    particleLimit:100,
    bomb:false,
    bomb_intensity:20
};
//settings menu selection
const menu = document.getElementsByClassName('menu')[0]
//about link selection
let about = document.getElementById('about')

//form events
menu.addEventListener('change',(e)=>{
    let {id, checked, value, type} = e.target
    
    formData= {...formData,[id]:type==='checkbox' ? checked:Number(value)}
    
    if(id==='bomb') e.target.parentElement.nextElementSibling.style.display= checked? 'flex':'none';
    console.dir(e.target.parentElement)

})
