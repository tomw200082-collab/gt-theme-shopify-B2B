class QuotesSectionAdmin extends QuotesSection {
  onBlockSelect(evt) {
    var ele = $(evt.target);
    if(ele.attr('data-slick-index') != undefined) {
      if(!ele.hasClass('slick-current')) {
        this.slider.slick('slickGoTo', ele.attr('data-slick-index'), true);
      }
      this.slider.slick('slickPause');
    }
  }
  onBlockDeselect() {
    if(this.slider.hasClass('slick-initialized')) {
      this.slider.slick('slickPlay');
    }
  }
  onUnload() {
    BT.destroySlider(this.container);
  }
}
theme.sections.constructors['quotes'] = QuotesSectionAdmin;