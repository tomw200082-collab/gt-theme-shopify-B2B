theme.cartTemplate = {};
let BTCartPage = {
	selectors: {
		content: '.cart-page__content',
		updateAllBtn: '.cart__update__all',
		qtyInput: '.cart__qty-input',
		crosssell: {
      wrap: '.cart-page__cross_sell',
      content: '.cart-page__cross_sell__content'
    },
    itemsTable: '.cart-page__items-table',
    countdown: '.cart-countdown'
	},

	data: {
		item_size: 0
	},

	initCartEvent: function() {
		$(document).on('ajaxCart.afterCartLoad', () => {
			BT.callAjax(theme.cartUrl, 'GET', {section_id: theme.cartTemplate.sectionId}, null, (html) => {
				$(this.selectors.content).html($(this.selectors.content, html).html());
        BT.convertCurrencySilence(this.selectors.content + ' span.money');
        var oldItemSize = this.data.item_size;
        this.updateItemSize();
        if(oldItemSize != this.data.item_size) {
          $(document).trigger('onReloadCrosssell');
        }
				if (window.Shopify && Shopify.StorefrontExpressButtons) {
	        Shopify.StorefrontExpressButtons.initialize();
	      }
        BT.resetCartTerms();
        if(this.data.item_size == 0 && $(this.selectors.countdown).length > 0) {
          $(this.selectors.countdown).addClass('hide');
          BT.setCookie('countdown_reverse_cart-page',null);
        }
	      if($('#shipping-calculator').length > 0 && "undefined" != typeof Shopify.Cart && "undefined" != typeof Shopify.Cart.ShippingCalculator) {
          Shopify.Cart.ShippingCalculator.show( {
            submitButton: theme.strings.shippingCalcSubmitButton,
            submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
            customerIsLoggedIn: theme.strings.shippingCalcCustomerIsLoggedIn,
            moneyFormat: theme.strings.shippingCalcMoneyFormat                                     
          });
        }
        BT.convertProgressBar();
			});
		});

		$(document).on('click', this.selectors.updateAllBtn, (e) => {
			e.preventDefault();
			BT.showLoadingFull();
      var ajaxData = {};
			var updateData = [];
			$(this.selectors.qtyInput).each((index, qtyEle) => {
				updateData.push($(qtyEle).val());
			});
      ajaxData.updates = updateData;
      if($('#CartSpecialInstructions').length > 0) {
        ajaxData.note = $('#CartSpecialInstructions').val();
      }
      BT.callAjax(theme.cartUpdateUrl, 'POST', ajaxData, 'json', (response) => {
				BT.updateHeaderCartHtml(true);
				BT.hideLoadingFull();
			});
		});
	},

  updateItemSize: function() {
    var table = $(this.selectors.itemsTable);
    if(table.length > 0) {
      this.data.item_size = table.find('tbody .cart__row').length;
    } else {
      this.data.item_size = 0;
    }
  },

	init: function() {
		this.initCartEvent();
	}
}

class CartTemplateSection extends BTSection {
  onInit() {
  	BTCartPage.updateItemSize();
    BT.initDealCountdown('.cart-countdown');
  }

  onLoad(evt) {
    if($('.cart-countdown').length > 0) {
      BT.setCookie('countdown_reverse_cart-page',null);
      BT.initDealCountdown('.cart-countdown');
    }
  }
  }

BTCartPage.init();
theme.sections.constructors['cart-template'] = CartTemplateSection;