class LayerBannerTextSection extends BTSection {
  onInit() {
    if(!Shopify.designMode) {
      const timeout = BT.data.cacheWindowWidth < BT.options.windowScreen.desktop ? 2300 : 1800;
      setTimeout(() => {
        this.runSliderBanner(this.container);
      }, timeout);
    } else {
      runSliderBanner(this.container);
    }
    BT.applyCustomColorSwatches(this.container);
    BT.initDealCountdown(this.container);
    
    this.slider = this.container.find(BT.getSliderSelector());
  }

  runSliderBanner(wrap) {
    wrap.find('.zoom-fade.lazyloaded').addClass('ignore-effect');
    BT.initSlider(wrap, true);
  }
}

theme.sections.constructors['layer-banner'] = LayerBannerTextSection;