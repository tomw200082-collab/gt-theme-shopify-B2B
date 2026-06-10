class SimpleProductSliderSection extends BTSection {
  onInit() {
    const delay = this.container.hasClass('load-ajax') ? -470 : 170;
    BT.initScrollingWindowTriggerOnce(this.container, 'simple-product-slider_' + this.sectionId, delay,() => {
      if(this.container.hasClass('load-ajax')) {
        const gridSelector = '#sps-products-' + this.sectionId;
        var grid = $(gridSelector);
        BT.loadDynamicProductsAjax(grid.attr('data-ajax-params'), 1, (html) => {
          grid.html($('.products', html).html());
          BT.initDealCountdown(grid);
          BT.initSlider(this.container, false);
          BT.applyCustomColorSwatches(grid);
          BT.reLoadReview(grid);
          BT.popularAddedWishlistItems(grid);
          BT.convertCurrencySilence(gridSelector + ' span.money');
        });
      } else {
        BT.initDealCountdown(this.container);
        BT.initSlider(this.container, true);
        BT.applyCustomColorSwatches(this.container);
      }
    });
  }
}
theme.sections.constructors['simple-product-slider'] = SimpleProductSliderSection;