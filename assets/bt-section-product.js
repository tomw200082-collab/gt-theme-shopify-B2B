$.extend(true, BT, {
  loadRecentViewedProductsSingle: function(point) {
    if(typeof point == 'undefined' || point.length == 0) {
      return;
    }
    var ins = this;
    var wrap = point.find('.rencent-view-ele');
    var list = wrap.find('.recent-view-list');
    var productHandle = wrap.attr('data-handle');
    var limit = parseInt(wrap.attr('data-limit'));
    var handleItems = this.getCookieItemsValue(true, this.options.recentView.cookieName);
    var index = handleItems.indexOf(productHandle);
    if(index > -1) {
      handleItems.splice(index, 1);
    }
    if(handleItems.length > 0) {
      handleItems.reverse();
      var q = handleItems.join(',');
      this.callAjax(theme.rootUrl, 'GET', {view:'recent_view_slider', q: q}, null, function(html) {
        if(list.hasClass('slick-initialized')) {
          list.slick('unslick');
        }
        list.html(html);
        if(list.find('.grid__item').length > 0) {
          ins.convertCurrencySilence(list.find('span.money'));
          ins.applyCustomColorSwatches(list);
          wrap.fadeIn(300, function() {
            ins.initSlider(wrap, false, false);
            ins.popularAddedWishlistItems(wrap);
          });
        }
      });
    }
  },

  initStickyCartProductPage: function() {
    if($('.sc').length > 0) {
      var ins = this;
      $('.sc').removeClass('hide');
      $(window).on(this.data.scrollEventName, function(e, direction) {
        if(ins.data.pageLoaded && BT.data.updatingProductOptions == false) {
          if(direction == 'down') {
            var btn = $('.button--single-cart-main');
            var headerHeight = $('.sticky-menu.active').length > 0 ? $('.sticky-menu').height() : 0;
            if($(window).scrollTop() + headerHeight > btn.offset().top) {
              $('.sc').addClass('sc--active');
              if(!$('.sc').hasClass('interaction') && ins.data.cacheWindowWidth >= 992) {
                $('.sc').addClass('open');
                $('.sc__inner').show();
              }
            } else {
              $('.sc').removeClass('sc--active');
              if(!$('.sc').hasClass('interaction') && ins.data.cacheWindowWidth >= 992) {
                $('.sc').removeClass('open');
                $('.sc__inner').hide();
              }
            }
          } else {
            $('.sc').removeClass('sc--active');
            if(!$('.sc').hasClass('interaction') && ins.data.cacheWindowWidth >= 992) {
              $('.sc').removeClass('open');
              $('.sc__inner').hide();
            }
          }
        }
      });

      var scSliding = false, statusClass = 'sc__close--working';
      if(ins.data.cacheWindowWidth < 992) {
        $('.sc__close').removeClass(statusClass);
        $('.sc__inner').hide();
        $('.sc').removeClass('open');
      } else {
        $('.sc__inner').show();
        // $('.sc').addClass('open');
      }

      $('.sc__close').on('click', function(e) {
        e.preventDefault();
        if(scSliding) {
          return;
        }
        if(!$('.sc').hasClass('interaction')) {
          $('.sc').addClass('interaction');
        }
        scSliding = true;
        $('.sc__inner').toggle('slow', function() {
          $('.sc__close').toggleClass(statusClass);
          scSliding = false;
          $('.sc').toggleClass('open');
        });
      });

      $('.sc__trigger').on('click touchend', function(e) {
        e.preventDefault();
        if(scSliding) {
          return;
        }
        scSliding = true;
        var effect = $('.sc').hasClass('open') ? 'slideUp': 'slideDown';
        if($('.sc').hasClass('open')) {
          $('.sc__inner').slideUp(300, toogleScClass);
        } else {
          $('.sc__inner').slideDown(300, toogleScClass);
        }
      });
      function toogleScClass() {
        $('.sc__close').toggleClass(statusClass);
        scSliding = false;
        $('.sc').toggleClass('open');
      }
      // Sync the main quantity input and this one in sticky panel
      $('.qty-box__input--single').on('change', function() {
        var input = this;
        $('.qty-box__input--single').each(function(){
          if(!$(this).is(input)) {
            $(this).val($(input).val());
          }
        });
      });
      var stickyCartBtn = $('.add-cart-btn-trigger');
      stickyCartBtn.click(function(e) {
        e.preventDefault();
        ins.startLoadingBtn($(this))
        var form = $('#' + $(this).attr('form'));
        form.find('.add-cart-btn').first().trigger('click');
      });
      $(document).on('ajaxCart.afterCartLoad', function() {
        ins.endLoadingBtn(stickyCartBtn);
      });
    }
  },
  
  initSizeChart: function() {
    if($('.sizechart-trigger').length > 0) {
      var ins = this;
      $('.sizechart-trigger').unbind('click');
      $('.sizechart-trigger').on('click', function(e) {
        e.preventDefault();
        if($(this).hasClass('sizechart-trigger--inline')) {
          var sizechartTable = $('.sizechart-table');
          var sizechartTab = sizechartTable.parents('.tab-pane');
          var delay = 0;
          if(!sizechartTab.hasClass('.active')) {
            var tabId = sizechartTab.attr('id');
            $('.nav-tab-item a[href="#' + tabId + '"]').trigger('click');
            delay = 300;
          }
          setTimeout(function() {
            var offset = sizechartTable.offset().top - 80;
            if($('.use-sticky').length > 0) {
              offset -= 60;
            }
            offset = offset + 'px';
            $('body,html').animate({
              scrollTop: offset
            }, 800);
          }, delay);
        } else {
          var modalId = $(this).attr('data-modal-id');
          ins.showPopup('#' + modalId);
        }
      });
    }
  }
});

class ProductTemplateSection extends BTSection {
  onInit() {
    const scriptDataTag = this.container.find('.product-single-json');
    if(scriptDataTag.length > 0) {
      const handle = scriptDataTag.attr('data-handle');
      BT.data.productGroup[handle] = $.parseJSON(scriptDataTag.html());
      BT.addProductRecentView(handle);
      const pg = this.container.find(BT.selectors.productGroup.wrap).first();
      BT.updateStorePickup(pg, BT.data.productGroup[handle][scriptDataTag.attr('data-current-variant-id')]);
    }
    BT.data.loadedSnippets.push('preload-product-single-general.css');
    const timeout = BT.data.cacheWindowWidth < 768 ? 2000: 500;
    BT.loadCssJsLib('slider', () => {
      BT.initProductThumbsSlider(this.container);
      BT.initProductMainSliderAndZoom(this.container, 1300, 1000);
    });
    BT.initDealCountdown(this.container);
    
    BT.applyCustomColorSwatches(this.container);

    setTimeout(() => {
      BT.initStickyCartProductPage();
      if($('.sc').length > 0) {
        BT.applyCustomColorSwatches('.sc');
      }
      
      var recentPoint = $('.rencent-view-ele-point');
      if(recentPoint.length > 0) {
        BT.loadRecentViewedProductsSingle(recentPoint);
      }

      // BT.calculateMinHeightHover('.related-list');
      BT.initSizeChart();
      BT.runProgressBar(this.container.find('.progress-bar'));

      if($('.pg__review-stars--trigger').length > 0) {
        $('.pg__review-stars--trigger').unbind('click');
        $('.pg__review-stars--trigger').on('click',function(e) {
          e.preventDefault();
          var reviewForm = $('.pg__review-form');
          var offsetObj = reviewForm;
          var delay = 0;
          var tabPane = reviewForm.parents('.tab-pane');
          if(tabPane.length > 0) {
            var tabId = tabPane.attr('id');
            if(BT.data.cacheWindowWidth < 991) {
              offsetObj = $('.tab-accordion__trigger[href="#' + tabId + '"]');
            } else {
              offsetObj = $('.nav-tab-item a[href="#' + tabId + '"]');  
            }
            
            if(!tabPane.hasClass('.active')) {
              offsetObj.trigger('click');
            }
            delay = 300;
          } else if (reviewForm.parents('.expand-content').length > 0) {
            var expand_trigger = reviewForm.parents('.expand-content').first().siblings('.expand-trigger').first();
            if(!expand_trigger.hasClass('open')) {
              expand_trigger.trigger('click');
            }
          }

          if(!BT.isInViewport(offsetObj, window)) {
            var offset = offsetObj.offset().top - 100;
            if($('.use-sticky').length > 0) {
              offset -= 60;
            }
            $('html, body').animate({
              scrollTop: offset
            }, 400);
          }
        });
      }

      BT.init3dModel(this.container, this.sectionId);
    }, timeout);
  }
}
theme.sections.constructors['product'] = ProductTemplateSection;