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

	loadCartCrosssellProduct: function(ele) {
    var ins = this;
    new Promise(function(resolve, reject) {
      if(ele.hasClass('crosssell__ele--ajax')) {
        ins.callAjax(ele.attr('data-url'), 'GET', {}, null, function(sectionHtml) {
          var html = $('.crosssell__ele', sectionHtml).html();
          ele.html(html);
          ins.sendRecommendationTrekkieEvent(ele);
          ins.reLoadReview(ele);
          resolve();
        }, function() {
          reject();
        });
      } else {
        if(ele.find('.cart-page__cross_sell__content').length > 0) {
          resolve();
        }
      }
    }).then(function() {
      ele.parents('.crosssell-cart-page-section').first().removeClass('hide');
      ins.initSlider(ele, false, false);
      ins.initDealCountdown(ele);
      ins.convertCurrencySilence(ele.find('span.money'));
      ins.applyCustomColorSwatches(ele);
    }, function(err) {
      ele.parents('section').first().hide();
    });
  },

  initReloadCrosssellEvent: function() {
    $(document).on('onReloadCrosssell', function() {
      $('.crosssell__ele--ajax').each(function() {
        BT.loadCartCrosssellProduct($(this));
      });
    });
  }
});

class CartCrosssellSection extends BTSection {
  onInit() {
    const crosssellEle = this.container.find('.crosssell__ele--ajax');
		if(crosssellEle.length > 0) {
	    BT.loadCartCrosssellProduct(crosssellEle);
	  }
  }
}

BT.initReloadCrosssellEvent();
theme.sections.constructors['cart-crosssell'] = CartCrosssellSection;