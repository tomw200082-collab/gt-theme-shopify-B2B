class RichBannerTextSectionAdmin extends RichBannerTextSection {
  onBlockSelect(evt) {
    var ele = $(evt.target);
    if(ele.attr('data-slick-index') != undefined) {
      this.slider.slick('slickGoTo', ele.attr('data-slick-index'), true).slick('slickPause');
      }
    }
  onBlockDeselect() {
    if(this.slider.hasClass('slick-initialized')) {
      this.slider.slick('slickPlay');
    }
  }
  onUnload() {
    BT.destroySlider(this.container);
    BT.destroyDealCountdown(this.container);
  }
}
theme.sections.constructors['rich-banner-text'] = RichBannerTextSectionAdmin;