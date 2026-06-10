$.extend(true, BT, {
	sendRecommendationTrekkieEvent: function(grid) {
    if (
      !window.ShopifyAnalytics ||
      !window.ShopifyAnalytics.lib ||
      !window.ShopifyAnalytics.lib.track
    ) {
      return;
    }

    var numberOfRecommendationsDisplayed = grid.find(
      '.grid__item'
    ).length;

    window.ShopifyAnalytics.lib.track('Product Recommendations Displayed', {
      theme: Shopify.theme.name,
      didPageJumpOccur: true,
      numberOfRecommendationsDisplayed: numberOfRecommendationsDisplayed
    });
  },

  loadRecommendationProduct: function(ele) {
    if(ele.length > 0) {
      const productId = ele.attr('data-product-id');
      const view = ele.data('view');
      if(!ele.hasClass('loaded')) {
        this.callAjax(ele.attr('data-url'), 'GET', {}, null, (sectionHtml) => {
          if($('.empty-products', sectionHtml).length == 0) {
            const html = $('.freb__inner-js', sectionHtml).html();
            let grid;
            if(view == 'slider') {
              grid = ele.children('.cross-sell-list');
              grid.html(html);
              grid.addClass(this.selectors.slider.useTouchMobile + ' ' + this.selectors.slider.default.replace('.',''));
              this.initSlider(ele, false, false);
              this.initDealCountdown(grid);
            } else {
              grid = ele.parents('.freb__inner-js').first();
              grid.append(html);
            }
            this.sendRecommendationTrekkieEvent(grid); 
            this.convertCurrencySilence(grid.find('span.money'));
            this.reLoadReview(grid);
            BTFreBought.init();
            ele.parent().find('.loading-not-full').remove();
          } else {
            ele.parents('.shopify-section').hide();
            $(window).trigger('bt_resize_window');
          }  
        }, () => {
          ele.parents('.shopify-section').hide();
          $(window).trigger('bt_resize_window');
        })
      } else {
        let grid;
        if(ele.find('.empty-products').length == 0) {
          if(view == 'slider') {
            grid = ele.children('.cross-sell-list');
            grid.addClass(this.selectors.slider.useTouchMobile + ' ' + this.selectors.slider.default.replace('.',''));
            this.initSlider(ele, false, false);
            this.initDealCountdown(grid);
            this.popularAddedWishlistItems(grid);
          } else {
            grid = ele.parents('.freb__inner').first();
            BTFreBought.init(); 
          }
          this.applyCustomColorSwatches(grid);
        } else {
          ele.parents('.shopify-section').hide();
          $(window).trigger('bt_resize_window');
        }
      }
    }
  }
});

class ProductCrosssellSection extends BTSection {
  onInit() {
    const crosssellEle = this.container.find('.load-crossell');
		if(crosssellEle.length > 0) {
	    BT.loadRecommendationProduct(crosssellEle);
	  } else if($('.freb__inner').length > 0) {
	    BTFreBought.init(); 
	  }
  }
}

theme.sections.constructors['product-crosssell'] = ProductCrosssellSection;