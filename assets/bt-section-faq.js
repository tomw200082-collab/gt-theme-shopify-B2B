class FaqSection extends BTSection {
  onBlockSelect(evt) {
    var ele = $(evt.target);
    var trigger = ele.find('.faq__trigger');
    if(!trigger.hasClass('open')) {
      trigger.trigger('click'); 
  }
    if(!BT.isInViewport(ele, evt.currentTarget.defaultView)) {
      var offset = ele.offset().top - 100;
      $('html, body').animate({
        scrollTop: offset
      }, 400);
    }
  }
  }
theme.sections.constructors['faq'] = FaqSection;