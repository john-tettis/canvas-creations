function animate(){
    updateAppBar();
    window.requestAnimationFrame(animate)
}
animate()