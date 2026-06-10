theme.faqSection.prototype = _.assignIn({}, theme.faqSection.prototype, {
  onBlockSelect: function(evt) {
    var ele = $(evt.target);
    var trigger = ele.find('.faq__trigger');
    if(trigger.hasClass('collapsed')) {
      trigger.trigger('click'); 
    }
    if(!BT.isInViewport(ele, evt.currentTarget.defaultView)) {
      var offset = ele.offset().top - 100;
      $('html, body').animate({
        scrollTop: offset
      }, 400);
    }
  },
  onUnload: function() {
    delete theme.faq[this.obj];
  }
});