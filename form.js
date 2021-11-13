let formData= {trails:false,gravity:.2, decrease:0, particleLimit:100};

const menu = document.getElementsByClassName('menu')[0]
//form events
menu.addEventListener('change',(e)=>{
    let {id, checked, value, type} = e.target
    
    formData= {...formData,[id]:type==='checkbox' ? checked:Number(value)}
    console.log(formData)
})
