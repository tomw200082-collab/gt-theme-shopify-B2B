class SimpleProductSliderSectionAdmin extends SimpleProductSliderSection {
  onLoad(evt) {
    BT.reLoadReview(this.container);
    BT.convertCurrencySilence(this.container.find('span.money'));
    }

  onBlockSelect(evt) {
    if(!BT.isInViewport(this.container, evt.currentTarget.defaultView)) {
      var offset = this.container.offset().top - 100;
      $('html, body').animate({
        scrollTop: offset
      }, 400);
    }
  }
  onUnload() {
    BT.destroyScrollingWindowTriggerOnce('simple-product-slider_' + this.sectionId);
  }
}
theme.sections.constructors['simple-product-slider'] = SimpleProductSliderSectionAdmin;