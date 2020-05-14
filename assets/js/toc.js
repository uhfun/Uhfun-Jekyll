// https://github.com/ghiculescu/jekyll-table-of-contents
(function($){
  $.fn.toc = function(options) {
    var defaults = {
      title: '<strong>目录</strong>',
      minimumHeaders: 3,
      headers: 'h1, h2, h3, h4, h5, h6',
      listType: 'ul', // values: [ol|ul]
      showEffect: 'fadeIn', // values: [show|slideDown|fadeIn|none]
      showSpeed: 'slow', // set to 0 to deactivate effect
      classes: { list: '',
                 item: ''
               }
    },
    settings = $.extend(defaults, options);

    function fixedEncodeURIComponent (str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
      });
    }

    function createLink (header) {
      var innerText = (header.textContent === undefined) ? header.innerText : header.textContent;
      return "<a class='toc-link' href='#" + fixedEncodeURIComponent(header.id) + "'>" + innerText + "</a>";
    }

    var headers = $(settings.headers).filter(function() {
      // get all headers with an ID
      var previousSiblingName = $(this).prev().attr( "name" );
      if (!this.id && previousSiblingName) {
        this.id = $(this).attr( "id", previousSiblingName.replace(/\./g, "-") );
      }
      return this.id;
    }), output = $(this);
    if (!headers.length || headers.length < settings.minimumHeaders || !output.length) {
      $(this).hide();
      return;
    }

    if (0 === settings.showSpeed) {
      settings.showEffect = 'none';
    }

    var render = {
      show: function() { output.hide().html(html).show(settings.showSpeed); },
      slideDown: function() { output.hide().html(html).slideDown(settings.showSpeed); },
      fadeIn: function() { output.hide().html(html).fadeIn(settings.showSpeed); },
      none: function() { output.html(html); }
    };

    var get_level = function(ele) { return parseInt(ele.nodeName.replace("H", ""), 10); };
    var highest_level = headers.map(function(_, ele) { return get_level(ele); }).get().sort()[0];
    var return_to_top = '<i class="icon-arrow-up back-to-top"> </i>';

    var level = get_level(headers[0]),
      this_level,
      html = settings.title + " <" +settings.listType + " class=\"toc-ol" + settings.classes.list +"\">";
    headers.on('click', function() {
        window.location.hash = this.id;
    })
    .addClass('clickable-header')
    .each(function(_, header) {
      this_level = get_level(header);
      if (this_level === highest_level) {
        $(header).addClass('top-level-header');
      }
      if (this_level === level) // same level as before; same indenting
        html += "<li class=\"" + settings.classes.item + "\">" + createLink(header);
      else if (this_level <= level){ // higher level than before; end parent ol
        for(var i = this_level; i < level; i++) {
          html += "</li></"+settings.listType+">"
        }
        html += "<li class=\"" + settings.classes.item + "\">" + createLink(header);
      }
      else if (this_level > level) { // lower level than before; expand the previous to contain a ol
        for(i = this_level; i > level; i--) {
          html += "<span class='show-sub'><i class='fa fa-caret-up' aria-hidden='true'></i></span>" + 
                  "<" + settings.listType + " class=\"toc-sub-ol toc-ol" + settings.classes.list +"\">" +
                  "<li class=\"" + settings.classes.item + "\">"
        }
        html += createLink(header);
      }
      level = this_level; // update for the next one
    });
    html += "</"+settings.listType+">";
    render[settings.showEffect]();
  };

  var headerOffsets = (tocHeight) => {
    var titles = []
    $('.clickable-header').each((i, h) => {
      var $h = $(h);
      titles.push({
        "href": '#' + encodeURI($h.attr('id')),
        "offsetTop": $h.offset().top - tocHeight        
      });
    })  
    return titles;
  } 
  // 隐藏/关闭
  $(document).on('click', '.show-sub', function() {
    var that = $(this), svg = that.children('svg');
    var li = that.parent();      
    if (li.hasClass('toc-open')) {
      closeLi(li);      
    } else {
      openLi(li);      
    }      
  });

  var nearestHeader = function(scrollS, min, array) {
    var nearest = array[0];
    array.forEach((item,index,arr) => {
      if (Math.abs(item.offsetTop - scrollS) < Math.abs(min)) {
        nearest = item;
        min = item.offsetTop - scrollS;
      }          
    })
    return nearest;    
  }

  var openLi = function($li) {
    if (!$li.hasClass('toc-open')) {
      closeLi($li.siblings('.toc-open'));
      $li.addClass('toc-open')  
      $li.children('.toc-sub-ol').slideToggle(240);
      $li.children('.show-sub').children('svg').addClass('fa-caret-down').removeClass('fa-caret-up');           
    }    
  }

  var closeLi = function($li) {
    $li.removeClass('toc-open')    
    $li.children('.toc-sub-ol').slideToggle(240);
    $li.children('.show-sub').children('svg').addClass('fa-caret-up').removeClass('fa-caret-down');           
  }

  var windowTop=0, $toc = $('#toc'), titles = [];
  $(window).scroll(() => {
    var scrollS = $(this).scrollTop();  
    let h = $toc.outerHeight();    
    if ($toc.html() != '') {   
      if (titles.length == 0) {
        titles = headerOffsets( h + 30);
        console.log(titles)    
      }     
      if (scrollS >= h + 240) {
        if (!$toc.hasClass('toc-suspend') && $toc.is(":visible")) {
          $toc.addClass('toc-suspend')
          if ($toc.css('position') == 'fixed') {
            $('html,body').scrollTop(scrollS - h)
          }          
        }
        if ($toc.css('position') == 'fixed' && scrollS >= windowTop && $toc.is(":visible")) {
          $toc.fadeOut();
        } 
        if ($toc.css('position') == 'fixed' && scrollS < windowTop && !$toc.is(":visible") ) {
          $toc.fadeIn()
        }       
        if (scrollS < windowTop) {   
          var $checkedA = $("[href='"+nearestHeader(scrollS, 99999, titles).href+"']");
          $('.checked-a').removeClass('checked-a');
          $checkedA.addClass('checked-a')
          var $li = $checkedA.parent();      
          if ($li.children('.toc-sub-ol').length == 0) {
            closeLi($li.siblings('.toc-open'));
            $li = $li.parent().parent();
          }
          while($li.parent().hasClass('toc-ol')) {
            openLi($li);
            $li = $li.parent().parent();
          }
        }
      } 
      if (scrollS < 240) {
        $toc.removeClass('toc-suspend')
        $toc.fadeIn()        
        closeLi($toc.children('.toc-ol').children('.toc-open'));
      }
    }    
    windowTop=scrollS;
  });

})(jQuery);



