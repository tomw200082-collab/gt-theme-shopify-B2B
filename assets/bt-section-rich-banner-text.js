/********* --- Rich Banner Text --- *********/
class RichBannerTextSection extends BTSection {
  onInit() {
    const effect = BT.data.cacheWindowWidth < BT.options.windowScreen.desktop ? false : true;
    if(!Shopify.designMode) {
      const timeout = BT.data.cacheWindowWidth < BT.options.windowScreen.desktop ? 2300 : 0;
      setTimeout(() => {
        this.runSliderBanner(effect);
      }, timeout);
    } else {
      this.runSliderBanner(effect);
    }
    BT.applyCustomColorSwatches(this.container);
    BT.initDealCountdown(this.container);
    if(this.container.find('.load-ajax').length > 0) {
      const delay = BT.data.cacheWindowWidth >= 992 ? -170 : -370; 
      BT.initScrollingWindowTriggerOnce(this.container, 'rich-banner-product-list_' + this.sectionId, delay, function() {
        this.container.find('.load-ajax').each(function() {
          const grid = $(this);
          BT.loadDynamicProductsAjax(grid.attr('data-ajax-params'), 1, function(html) {
            const finalHtml = $('.products', html).html();
            if(grid.find('.rb__products-heading').length > 0) {
              finalHtml = '<div class="grid__item rb__products-heading">' + grid.find('.rb__products-heading').html() + '</div>' + finalHtml;
            }
            grid.html(finalHtml);
            BT.initDealCountdown(grid);
            BT.applyCustomColorSwatches(grid);
            BT.reLoadReview(grid);
            BT.popularAddedWishlistItems(grid);
            BT.convertCurrencySilence('#' + grid.attr('id') + ' span.money');
          });
        });
      }.bind(this));
    }
    
    this.slider = this.container.find(BT.getSliderSelector());
  }

  runSliderBanner(effect) {
    this.container.find('.zoom-fade.lazyloaded').addClass('ignore-effect');
    BT.initSlider(this.container, true, effect);
  }
}
theme.sections.constructors['rich-banner-text'] = RichBannerTextSection;