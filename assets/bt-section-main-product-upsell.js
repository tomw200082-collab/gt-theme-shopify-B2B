class ProductUpsellSection extends BTSection {
  onInit() {
    var upsellWrap = this.container.find('.upsell-ele--single');
    if(upsellWrap.length > 0) {
      if(!Shopify.designMode) {
        BT.initScrollingWindowTriggerOnce(upsellWrap, 'upsell_single', -170, () => {
          BT.loadUpsell(this.container.find(BT.selectors.upsell.wrap));
        });
      } else {
        BT.loadUpsell(this.container.find(BT.selectors.upsell.wrap));
      }
    }
  }
}

theme.sections.constructors['main-product-upsell'] = ProductUpsellSection;