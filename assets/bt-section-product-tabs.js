$.extend(true, BT, {
  initProductTabs: function(wrap, sectionId) {
    var ins = this;
    
    if(wrap.hasClass('has-available-data')) {
      var firstSliderWrap;
      if(typeof wrap == 'string') {
        firstSliderWrap = wrap + ' .tab-pane:first';
        wrap = $(wrap);
      } else {
        firstSliderWrap = wrap.find('.tab-pane:first');
      }
      this.convertCurrencySilence(wrap.find('span.money'));
      this.initScrollingWindowTriggerOnce(wrap, 'product-tabs_deal_slider_' + sectionId, -170, function() {
        ins.initDealCountdown(wrap);
        ins.initSlider(firstSliderWrap, false, false);
      });  
    }
    
    this.initInfiniteScroll(wrap);
    if(wrap.find(this.selectors.waitingTabData).length > 0) {
      ins.initScrollingWindowTriggerOnce(wrap, 'product-tabs_ajax_' + sectionId, -450, function() {
        BT.renderSectionByAjaxApi(sectionId, {}, function(response) {
          wrap.find(ins.selectors.waitingTabData).each(function() {
            var parent = $(this).parent();
            $(this).remove();
            parent.html('');
            var html = $('#' + parent.attr('id'), response).parent()[0].outerHTML;
            ins.afterLoadDynamicProductsAjaxInTab(parent, html);
            BT.initSlider(parent.parent(), false, false);
          });
          BT.addProductMetaData(wrap, true);
        });
      });
    }
    wrap.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var tabContent = $($(e.target).attr('href'));
      if (tabContent.find(ins.selectors.infiniteScroll.wait).length > 0) {
        tabContent.find(ins.selectors.infiniteScroll.wait).removeClass(ins.selectors.infiniteScroll.wait.replace('.','')).addClass(ins.selectors.infiniteScroll.button.replace('.',''));
        ins.initInfiniteScroll(tabContent);
      }
      if(Shopify.designMode) {
        if(tabContent.hasClass('opened')) {
          BT.destroyDealCountdown(tabContent);
          BT.destroySlider(tabContent);
        }
        BT.initDealCountdown(tabContent);
        BT.initSlider(tabContent, false, false);
        tabContent.addClass('opened');
      }
    });
  },

  unLoadProductTabs: function(wrap) {
    const sectionId = wrap.attr('data-section-id');
    this.destroyInfiniteScroll(wrap.attr('data-section-id'));
    this.destroyScrollingWindowTriggerOnce('product-tabs_ajax_' + sectionId);
    this.destroyScrollingWindowTriggerOnce('product-tabs_deal_slider_' + sectionId);
    this.destroyDealCountdown(wrap);
  }
});

class ProductTabsSection extends BTSection {
  onInit() {
    BT.initProductTabs(this.container, this.sectionId);
  }
}

theme.sections.constructors['product-tabs'] = ProductTabsSection;