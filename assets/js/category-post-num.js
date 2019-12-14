$(document).ready(() => {
    $('.month').each((i, e) => {
        const $m = $(e);
        $m.children('.head-month').children('.head-month-post-num').text("[ "+$m.children('ul').children().length+" ]")
    });    
});