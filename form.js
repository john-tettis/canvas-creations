let formData= {
    trails:false,
    gravity:.2, 
    growth:0, 
    particleLimit:100,
    bomb:false,
    bomb_intensity:20,
    complementary:false,
    friction:0
};
//settings menu selection
const menu = document.getElementById('menu')
//about link selection
let about = document.getElementById('about')

//form events
menu.addEventListener('input',(e)=>{
    let {id, checked, value, type} = e.target
    
    formData= {...formData,[id]:type==='checkbox' ? checked:Number(value)}
    console.log(formData)
    if(id==='bomb') e.target.parentElement.parentElement.nextElementSibling.style.display= checked? 'flex':'none';
    console.dir(e.target.parentElement)

})
