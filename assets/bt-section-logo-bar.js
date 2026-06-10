/********* --- Logo list --- *********/
class LogoListSection extends BTSection {
  onInit() {
    if(!Shopify.designMode) {
      const timeout = BT.data.cacheWindowWidth < BT.options.windowScreen.desktop ? 2300 : 1800;
      setTimeout(function(){
        BT.initSlider(this.container, true);
      }.bind(this), timeout);
    } else {
      BT.initSlider(this.container, true);
    }
    this.slider = this.container.find(BT.getSliderSelector());
  }
}
theme.sections.constructors['logo-bar'] = LogoListSection;