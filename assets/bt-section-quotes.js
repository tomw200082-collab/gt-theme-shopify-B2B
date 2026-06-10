class QuotesSection extends BTSection {
  onInit() {
    if(!Shopify.designMode) {
      var timeout = BT.data.cacheWindowWidth < BT.options.windowScreen.desktop ? 2300 : 1800;
      setTimeout(() => {
        BT.initSlider(this.container, true);
      }, timeout);
    } else {
      BT.initSlider(this.container, true);
    }
    this.slider = this.container.find(BT.getSliderSelector());
  }
}
theme.sections.constructors['quotes'] = QuotesSection;