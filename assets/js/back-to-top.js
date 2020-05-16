const maxHeight = 400;
var ticking = false; // rAF 触发锁
 
function onScroll(){
  if(!ticking) {
    requestAnimationFrame(realFunc);
    ticking = true;
  }
}
 
function realFunc(){    
    $('.back-to-top').css("opacity", document.documentElement.scrollTop > maxHeight || document.body.scrollTop > maxHeight ? 1 : 0)
    ticking = false;
}
// 滚动事件监听
window.addEventListener('scroll', onScroll, false);
$(document).on('click', '.back-to-top', function() {
    $(this).addClass('to-top')
    window.scrollTo({
		top: 0,
		behavior: 'smooth'
    })    
})