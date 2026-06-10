class ProductColumnsSectionAdmin extends ProductColumnsSection {
  onLoad(evt) {
    BT.reLoadReview(this.container);
    BT.convertCurrencySilence(this.container.find('span.money'));
    }

  onBlockSelect(evt) {
    var ele = $(evt.target);
    if(!BT.isInViewport(ele, evt.currentTarget.defaultView)) {
      var offset = ele.offset().top - 100;
      $('html, body').animate({
        scrollTop: offset
      }, 400);
    }
  }
  onUnload() {
    BT.destroySlider(this.container);
    BT.destroyDealCountdown(this.container);
  }
}
theme.sections.constructors['product-columns'] = ProductColumnsSectionAdmin;