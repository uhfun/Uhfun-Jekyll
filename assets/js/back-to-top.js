const maxHeight=400;window.onscroll=()=>{$('.back-to-top').css("opacity",document.documentElement.scrollTop>maxHeight||document.body.scrollTop>maxHeight?1:0)};$(".back-to-top").click(()=>{window.scrollTo({top:0,behavior:'smooth'})});