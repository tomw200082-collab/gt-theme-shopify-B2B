$.extend(true, BT, {
	initProductThumbsSlider: function(wrap) {
    var ins = this, options = this.options.productGroup, selector = this.selectors.productGroup;
    if(wrap.find(selector.thumbsSlider).length > 0) {
      this.loadCssJsLib('slider', function() {
        wrap.find(selector.thumbsSlider).each(function() {
          var optionsSlider = {};
          $.extend(true, optionsSlider, options.smallSlider);
          if($(this).hasClass(selector.thumbsSliderVerticalClass)) {
            optionsSlider.vertical = true; 
            optionsSlider.verticalSwiping = true; 
          }
          optionsSlider.prevArrow = $(this).siblings('.slick-prev');
          optionsSlider.nextArrow = $(this).siblings('.slick-next');
          ins.preInitSlider($(this), true);
          $(this).slick(optionsSlider);
        });
      });
    }
  },

  destroyProductThumbsSlider: function(wrap) {
    var selector = this.selectors.productGroup;
    if(wrap.find(selector.thumbsSlider).length > 0) {
      wrap.find(selector.thumbsSlider).each(function(index, thumbSliderEle) {
        $(thumbSliderEle).slick('unslick');
      });
    }
  },

  pauseCurrentProductVideo: function(pg) {
    if(this.data.productVideo.currentPlayer != null) {
      pg.find(this.selectors.mediaBtn).removeClass('hide');
      var currentVideoType = this.data.productVideo.currentType;
      if(currentVideoType == 'youtube' && this.data.productVideo.loadYoutubeApi) {
        this.data.productVideo.currentPlayer.pauseVideo();
        $('#' + this.data.productVideo.currentYoutubePlayerId).parents('.youtube-wrapper').addClass('hide');
      } else if(currentVideoType == 'vimeo' && this.data.productVideo.loadVimeoApi) {
        this.data.productVideo.currentPlayer.pause();
        $('#' + this.data.productVideo.currentVimeoPlayerId).addClass('hide');
      } else {
        this.data.productVideo.currentPlayer.pause();
      }
      this.data.productVideo.currentPlayer = null;
      this.data.productVideo.currentType = null;
    }
  },

  playProductVideo: function(pg, ele) {
    var selector = this.selectors.productGroup;
    var videoEle = ele.find(selector.video);
    if(videoEle.length > 0) {
      pg.find(this.selectors.mediaBtn).addClass('hide');
      if(videoEle.hasClass(selector.videoYoutube.replace('.',''))) {
        this.loadCssJsLib("youtube", function(){
          if(this.data.productVideo.loadYoutubeApi) {
            this.initYoutubePlayer(videoEle);
          } else {
            var checkYT = setInterval(function () {
              if(YT.loaded){
                clearInterval(checkYT);
                this.data.productVideo.loadYoutubeApi = true;
                this.initYoutubePlayer(videoEle);
              }
            }.bind(this), 100);
          }
        }.bind(this));
      } else if(videoEle.hasClass(selector.videoVimeo.replace('.',''))) {
        this.loadCssJsLib("vimeo", function(){
          this.data.productVideo.loadVimeoApi = true;
          this.initVimeoPlayer(videoEle);
        }.bind(this));
      } else {
        this.data.productVideo.currentType = 'custom';
        this.data.productVideo.currentPlayer = videoEle.get(0);
        this.data.productVideo.currentPlayer.play();
      }
    }
  },

  initYoutubePlayer: function(videoEle) {
    var playerId = videoEle.attr('data-player-id');
    var videoId = videoEle.attr('data-video-id');
    var playerEle = $('#' + playerId);
    playerEle.parents('.youtube-wrapper').removeClass('hide');
    videoEle.css('opacity',0);
    this.data.productVideo.currentYoutubePlayerId = playerId;
    this.data.productVideo.currentType = 'youtube';
    if(playerEle.hasClass('loaded')) {
      YT.get(playerId).playVideo();
    } else {
      playerEle.addClass('loaded');
      new YT.Player(playerId, {
        height: '480',
        width: '100%',
        playerVars :{
          autohide: 0,
          autoplay: 1,
          branding: 0,
          cc_load_policy: 0,
          controls: 1,
          fs: 1,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 0,
          quality: 'hd720',
          rel: 0,
          showinfo: 0,
          wmode: 'opaque'
        },
        videoId: videoId,
        events: {
          'onReady': function(event) {
            event.target.mute();
            event.target.playVideo();
          }
        }
      });
    }
    this.data.productVideo.currentPlayer = YT.get(playerId);
  },

  initVimeoPlayer: function(videoEle) {
    var iframe = $('#' + videoEle.attr('data-player-id'));
    var id = iframe.attr('id');
    this.data.productVideo.currentType = 'vimeo';
    this.data.productVideo.currentVimeoPlayerId = id;
    if(this.data.productVideo.vimeoPlayers[id] == undefined) {
      // vimeoPlayers[id] = new Vimeo.Player(iframe);
      iframe.removeClass('hide');
      var player = new Vimeo.Player(iframe.get(0), {width: 800});
      player.setVolume(0);
      player.play();
      this.data.productVideo.currentPlayer = player;
    } else {
      this.data.productVideo.currentPlayer = this.data.productVideo.vimeoPlayers[id];
      this.data.productVideo.currentPlayer.play();
    }
  },

  play3dModel: function(modelViewContainer) {
    if(!modelViewContainer.hasClass('loaded')) {
      modelViewContainer.trigger('mediaVisible');
      modelViewContainer.addClass('loaded');
    }
  },

  init3dModel: function(container, sectionId) {
    var $modelViewerElements = $(
      '[data-product-media-type-model]',
      container
    );
    if ($modelViewerElements.length < 1) return;
    theme.ProductModel.init($modelViewerElements, sectionId);
  },

  initProductMainSliderAndZoom: function(wrap, timeoutMobile, timeoutDesktop) {
    var ins = this, options = this.options.productGroup, selector = this.selectors.productGroup;
    if(wrap.find(selector.mainsSlider).length > 0) {
      var timeout = ins.data.cacheWindowWidth < 768 ? timeoutMobile : timeoutDesktop;
      setTimeout(function() {
        BT.loadCssJsLib('slider', function() {
          wrap.find(selector.mainsSlider).each(function() {
            var optionsSlider = {};
            $.extend(true, optionsSlider, options.mainSlider);
            ins.preInitSlider($(this), true);
            var slider = $(this).slick(optionsSlider);
            var pg = $(this).parents(selector.wrap);
            ins.playProductVideo(pg, slider.find('.slick-current'));
            ins.initProductMainZoom(pg);
            slider.on('afterChange', function(event, slick, currentSlide, nextSlide){
              var mainLink = slick.$slider.find('.slick-current ' + selector.mainLink);
              if(pg.find(selector.thumbs).length > 0) {
                var thumbs = pg.find(selector.thumbs);
                var thumbLink = thumbs.find(selector.thumb + ':not(slick-clone) ' + selector.thumbLink + '[data-image-id="' + mainLink.attr('data-image-id') + '"]');
                thumbLink.trigger('click', true);
              }
              ins.initProductMainZoom(pg);
              ins.pauseCurrentProductVideo(pg);
              ins.playProductVideo(pg, slick.$slider.find('.slick-current'));
              if(mainLink.hasClass(selector.mainLinkModel.replace('.',''))) {
                ins.play3dModel(mainLink);
                slider.slick("slickSetOption", "swipe", false, false);
                slider.addClass('play-model');
              } else if(slider.hasClass('play-model')) {
                slider.slick("slickSetOption", "swipe", true, false);
                slider.removeClass('play-model');
              }
              if(mainLink.hasClass(selector.ignoreLightBoxClass)) {
                slider.addClass('no-light-box-icon');
              } else {
                slider.removeClass('no-light-box-icon');
              }
            });
          });  
        });
      }, timeout);
    } else {
      ins.initProductMainZoom($(prefixSelector + selector.wrap));
    }
  },

  destroyProductMainSliderAndZoom: function(wrap) {
    var ins = this, selector = this.selectors.productGroup;
    if(wrap.find(selector.mainsSlider).length > 0) {
      wrap.find(selector.mainsSlider).each(function(index, mainSlider) {
        $(mainSlider).slick('unslick');
        var pg = $(mainSlider).parents(selector.wrap);
        ins.destroyProductMainZoom(pg);
      });
    }
  },

  initProductMainZoom: function(pg) {
    if(this.data.cacheWindowWidth <= 1200) {
      return;
    }
    var selector = this.selectors.productGroup, ins = this;
    var currentSize = pg.find(selector.mainLinkZoom).length;
    if(currentSize > 0) {
      this.loadCssJsLib("zoom", function() {
        pg.find(selector.mainLinkZoom).each(function() {
          var mainLink = $(this);
          mainLink.trigger('zoom.destroy');
          mainLink.zoom({url: mainLink.attr('href')});
          $(window).on(ins.data.resizeEventName, function() {
            if(ins.data.cacheWindowWidth >= 1200 ) {
              mainLink.zoom({url: mainLink.attr('href')});
            } else {
              mainLink.trigger('zoom.destroy');
            }
          });
        });
      });
    }
  },

  destroyProductMainZoom: function(pg) {
    if(this.data.cacheWindowWidth <= 1200) {
      return;
    }
    var selector = this.selectors.productGroup;
    var currentSize = pg.find(selector.mainLinkZoom).length;
    if(currentSize > 0) {
      pg.find(selector.mainLinkZoom).each(function() {
        $(this).trigger('zoom.destroy');
      });
    }
  },

  changeMainImage: function(pg, orgSrc) {
    var selector = this.selectors.productGroup, ins = this;
    pg.find(selector.mainImg).each(function() {
      var image = $(this);
      var imageSize = image.attr('data-image-size');
      var newImageSrc;
      if(imageSize != undefined) {
        newImageSrc = ins.resizeImage(orgSrc, imageSize).replace('_1x1.', '_{width}x.');
      } else {
        newImageSrc = orgSrc;
      }
      image.parent(':not(.not-loading)').addClass('loading');
      image.attr('data-src', newImageSrc);
      image.addClass('lazyload');
      pg.removeClass(selector.loadingClass);
    });
  },

  updateMainThumbnail: function(pg, thumbLink, orgSrc, imageId) {
    if(thumbLink == null || thumbLink.length == 0) {
      if(orgSrc == null) {
        return;
      }
      this.changeMainImage(pg, orgSrc);
    } else {
      var selector = this.selectors.productGroup, index;
      var mainLink;
      if(imageId != undefined) {
        mainLink = pg.find(selector.mainLink + '[data-image-id="' + imageId + '"]');
      } else {
        mainLink = pg.find(selector.mainLink + '[data-image-id="' + thumbLink.attr('data-image-id') + '"]');
      }
      if(pg.find(selector.mainsSlider).length > 0) { // Mains images is slider
        // var mainLink = pg.find(selector.mainLink + '[data-image-id="' + thumbLink.attr('data-image-id') + '"]');
        index = mainLink.parents('.slick-slide').first().attr('data-slick-index');
        /*if(mainLink.find('img').hasClass('lazyload')) {
          mainLink.find('img').addClass('lazypreload');
        }*/
        this.gotoSliderIndex(pg.find(selector.mainsSlider), index);
      } else {
        this.changeMainImage(pg, thumbLink.attr('href'));
      }  
    }
  },

  updateStorePickup: function(pg, variant) {
    var selector = this.selectors.productGroup;
    var storePickupWrap = pg.find(selector.storePickupWrap);
    if(storePickupWrap.length > 0) {
      if(!variant.available) {
        storePickupWrap.addClass('hide');
      } else {
        storePickupWrap.addClass('loading-store-data');
        var url = theme.rootUrl + 'variants/' + variant.id;
        this.callAjax(url, 'get', {section_id: 'store-availability'}, null, function(response) {
          var information = $('.store-availability-information', response);
          if(information.length > 0) {
            storePickupWrap.find(selector.storePickupInner).html(information[0].outerHTML);
            $('body').find(selector.storePickupModel).remove();
            $('body').append($(selector.storePickupModel, response));
            $(selector.storePickupProductTitle).text(pg.find('.product-single__title').text());
            if(storePickupWrap.hasClass('hide-default-title')) {
              $(selector.storePickupVariantTitle).hide();
            }
            storePickupWrap.removeClass('hide');
          } else {
            storePickupWrap.addClass('hide');
          }
          storePickupWrap.removeClass('loading-store-data');
        });
      }
    }
  },

	updateNewVariant: function(pg, newVariant, availableOption2, availableOption3, isUpdateMain, syncOtherGroup, isClickLastOption) {
    var selector = this.selectors.productGroup, options = this.options.productGroup, ins = this;
    // Update price
    pg.find(selector.price).html(this.getVariantPriceHtml(pg, newVariant));
    pg.find(selector.stickySmallPrice).html(this.getPriceHtml(newVariant.price));

    this.convertCurrencySilence(pg.find('span.money'));

    this.updateStorePickup(pg, newVariant);

    // Reset out stock option
    var outStockGroup = BT.data.outStockGroup[pg.attr('data-product-handle')];
    var needResetOutStockGroup = !isClickLastOption && outStockGroup != undefined;
    var prefixSelectOutStockGroup = [], optionSize = newVariant.options.length;

    if(newVariant) {
      if(needResetOutStockGroup) {
        pg.find(selector.option + '.last ' + selector.optionValue).removeClass(selector.swatchOutStock);  
      }
      pg.find(selector.option + '.last ' + ' option').removeAttr('disabled');
      for(var i = 0; i < newVariant.options.length - 1; i++) {
        prefixSelectOutStockGroup.push(newVariant.options[i]);
      }
    }

    // Update swatch options
    pg.find(selector.option).each(function() {
      var index = $(this).attr('data-index'), isSwatch = $(this).hasClass('swatch'), isLastOption = $(this).hasClass('last');
      if(isSwatch) {
        $(this).find('.selected,.hide').removeClass('selected hide');
        $(this).find(selector.optionValue).each(function() {
          if($(this).attr('data-value') == newVariant.options[index]) {
            $(this).addClass('selected');
          }
          if(index == 1 && availableOption2.indexOf($(this).attr('data-value')) == -1) {
            $(this).addClass('hide');
          } else if (index == 2 && availableOption3.indexOf($(this).attr('data-value')) == -1) {
            $(this).addClass('hide');
          }
          if(isLastOption && needResetOutStockGroup) {
            prefixSelectOutStockGroup.push($(this).attr('data-value'));
            var indexOutStockValue = prefixSelectOutStockGroup.join(' / ');
            if(outStockGroup.indexOf(indexOutStockValue) > -1) {
              $(this).addClass(selector.swatchOutStock);
            }
            prefixSelectOutStockGroup.pop();
          }
        });
      } else {
        $(this).find(selector.optionValue).each(function() {
          if(index > 0) {
            var availableOptions;
            if(index == 1) {
              availableOptions = availableOption2;
            } else if (index == 2) {
              availableOptions = availableOption3;
            }
            $(this).find('option').each(function() {
              $(this).removeClass('hide').removeAttr('selected').removeAttr('disabled');
              if(availableOptions.indexOf($(this).attr('value')) == -1) {
                $(this).addClass('hide').attr('disabled', 'disabled');
              }
              if(isLastOption && needResetOutStockGroup) {
                prefixSelectOutStockGroup.push($(this).attr('value'));
                var indexOutStockValue = prefixSelectOutStockGroup.join(' / ');
                if(outStockGroup.indexOf(indexOutStockValue) > -1) {
                  $(this).attr('disabled','disabled');
                }
                prefixSelectOutStockGroup.pop();
              }
            });
          }
          $(this).val(newVariant.options[index]);
        });
      }
    });

    // Update cart button
    if(newVariant.available) {
      var cartBtn = pg.find(selector.cartBtn);
      cartBtn.removeAttr('disabled');
      cartBtn.removeClass('soldout');
      var cartText;
      if(theme.preOrder && newVariant.inventory_policy == 'continue' && newVariant.inventory_quantity <= 0) {
        cartText = theme.strings.preOrderText;
      } else {
        cartText = theme.strings.addToCart;
      }
      cartBtn.attr('title', cartText);
      if(cartBtn.attr('data-toggle') == 'tooltip') {
        cartBtn.tooltip('fixTitle');
      }
      cartBtn.find('span').text(cartText);
      pg.find(selector.stockText).text(theme.strings.instockText).removeClass('soldout');
    } else {
      var cartBtn = pg.find(selector.cartBtn);
      cartBtn.attr('disabled','disabled');
      cartBtn.addClass('soldout');
      cartBtn.attr('title', theme.strings.soldOut);
      if(cartBtn.attr('data-toggle') == 'tooltip') {
        cartBtn.tooltip('fixTitle');
      }
      cartBtn.find('span').text(theme.strings.soldOut);
      pg.find(selector.stockText).text(theme.strings.soldOut).addClass('soldout');
    }

    // Update variant id and title
    pg.find(selector.variantId).val(newVariant.id);
    pg.find(selector.variantId).trigger('change');
    if(pg.find(selector.variantTitle).length > 0) {
      pg.find(selector.variantTitle).text(newVariant.title);
    }
    
    // Filter small and big images
    var currentThumbLink = pg.find(selector.thumbLink + '[data-image-id="' + newVariant.featured_media.id + '"]');
    
    // Update main image
    if(isUpdateMain) {
      this.updateMainThumbnail(pg, currentThumbLink, newVariant.featured_media.src, newVariant.featured_media.id);
    }

    // Update history
    if(pg.attr('data-history') != undefined) {
      var hrefParts = window.location.href.split('?');
      var newUrl = hrefParts[0] + '?';
      if(hrefParts.length > 1 && hrefParts[1]) {
        if(hrefParts[1].indexOf('variant') > -1) {
          newUrl += hrefParts[1].replace(/(variant=).*?(&|$)/,'$1' + newVariant.id + '$2');
        } else {
          newUrl += hrefParts[1] + '&variant=' + newVariant.id;
        }
      } else {
        newUrl += 'variant=' + newVariant.id;
      }
      // var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + newVariant.id;
      window.history.replaceState({path: newUrl}, '', newUrl);  
    }

    // Update deal label
    if(pg.find(selector.labelDeal).length > 0) {
      var label = pg.find(selector.labelDeal);
      if(newVariant.compare_at_price && newVariant.compare_at_price > newVariant.price) {
        label.removeClass('hide');
        if(label.find(selector.labelPercent).length > 0) {
          var percentNumber = Math.floor(((newVariant.compare_at_price - newVariant.price)/newVariant.compare_at_price)*100);
          label.find(selector.labelPercent).html(percentNumber + '%');
        }
      } else {
        label.addClass('hide');
      }
    }
    if(pg.find(selector.singleProgress).length > 0) {
      if(newVariant.available) {
        pg.find(selector.singleProgress).removeClass('hide');
        if(newVariant.inventory_quantity > 0) {
          pg.find(selector.stockText1).removeClass('hide');
          pg.find(selector.stockText2).addClass('hide');
        } else {
          pg.find(selector.stockText2).removeClass('hide');
          pg.find(selector.stockText1).addClass('hide');
        }
        if(pg.find(selector.stockNumber).length > 0) {
          pg.find(selector.stockNumber).text(newVariant.inventory_quantity);
        }
      } else {
        pg.find(selector.singleProgress).addClass('hide');
      }
    }

    // Sync the variant
    if(pg.find(selector.syncUrl).length > 0) {
      var syncUrl = pg.find(selector.syncUrl).attr('href').split('?')[0];
      var newSyncUrl = syncUrl + '?variant=' + newVariant.id;
      pg.find(selector.syncUrl).attr('href', newSyncUrl);
    }

    // Update SKU
    var skuTag = pg.find(selector.sku);
    if(skuTag.length > 0) {
      if(newVariant.sku) {
        skuTag.text(newVariant.sku);
        skuTag.parent().removeClass('hide');
      } else {
        skuTag.parent().addClass('hide');
      }
    }

    // Sync to other same pg
    if(pg.attr('data-sync-pg') != undefined && syncOtherGroup) {
      $(pg.attr('data-sync-pg')).each(function() {
        $(this).find(selector.groupData).attr('data-value',pg.find(selector.groupData).attr('data-value'));
        ins.updateNewVariant($(this), newVariant, availableOption2, availableOption3, true, false, isClickLastOption);
      });
    }   
  },

  initMainLightboxGallery: function() {
    var selector = this.selectors.productGroup, ins = this;
    $(document).on('click', selector.mainLink, function(e) {
      if(!$(this).hasClass(selector.ignoreLightBoxClass)) {
        e.preventDefault();
        var mediaBtn = $(this).siblings(ins.selectors.mediaBtn);
        if(mediaBtn.length > 0) {
          mediaBtn.trigger('click',[$(this).attr('data-image-id')])
        } else {
          $(this).parents(selector.wrap).find(ins.selectors.mediaBtn).trigger('click',[$(this).attr('data-image-id')]);  
        }
      }
    });
  },

  openLightboxByPhotoswipe: function(pg, currentImageId) {
    var ins = this, selector = this.selectors.productGroup;
    if(pg.find(selector.mainLink).length > 0) {
      var items = [];
      var activeIndex = 0;
      var indexImage = 0;
      pg.find(selector.mainLink + ':not(.hide)').each(function(index, element) {
        if($(this).hasClass(selector.ignoreLightBoxClass)) {
          return;
        }
        var ele = $(this);
        var title = ele.attr('title');
        if(title) {
          title = title.replace(/ group-(.*?) /g, ' ').replace(/group-(.*?) /g, '').split('group')[0];
        }
        if(currentImageId != undefined) {
          if($(this).attr('data-image-id') == currentImageId) {
            activeIndex = indexImage;
          }
        } else if($(this).parent().hasClass('active')) {
          activeIndex = indexImage;
        }
        items.push({
          src: ele.attr('href'),
          w: ele.attr('data-width'),
          h: ele.attr('data-height'),
          msrc: ins.resizeImage(ele.attr('href'), '96x'),
          title: title,
          el: ele.parent()[0]
        });
        indexImage++;
      });
      var pswpElement = document.querySelectorAll('.pswp')[0];
      // define options (if needed)
      var options = {
          // optionName: 'option value'
          // for example:
          index: activeIndex, // start at first slide,
          getThumbBoundsFn: function(index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                rect = thumbnail.getBoundingClientRect(); 

            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
          },
          shareButtons: []
      };
      var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
    }
  },

  openLightboxByLightGallery: function(pg, currentImageId) {
    var ins = this, selector = this.selectors.productGroup;
    if(pg.find(selector.mainLink).length > 0) {
      var data = [];
      var activeIndex = 0;
      var indexImage = 0;
      pg.find(selector.mainLink + ':not(.hide)').each(function(index, element) {
        if($(this).hasClass(selector.ignoreLightBoxClass)) {
          return;
        }
        var ele = $(this);
        var title = ele.attr('title');
        if(title) {
          title = title.replace(/ group-(.*?) /g, ' ').replace(/group-(.*?) /g, '').split('group')[0];
        }
        if(currentImageId != undefined) {
          if($(this).attr('data-image-id') == currentImageId) {
            activeIndex = indexImage;
          }
        } else if($(this).parent().hasClass('active')) {
          activeIndex = indexImage;
        }
        data.push({
          src: ele.attr('href'),
          thumb: ins.resizeImage(ele.attr('href'), '96x'),
          subHtml: title
        });
        indexImage++;
      });
      if(rtl) {
        data.reverse();
        activeIndex = indexImage - activeIndex - 1;
      }
      if(pg.data('lightGallery')) {
        pg.off('onCloseAfter.lg');
      }
      pg.lightGallery({
        dynamic: true,
        dynamicEl: data,
        index: activeIndex,
        download: false
      });
      pg.on('onCloseAfter.lg',function(event){
        setTimeout(function() {
          if(typeof pg.data('lightGallery') != 'undefined') {
            pg.data('lightGallery').destroy(true);
          }
        }, 300);
      });
    }
  },

  initMediaButton: function() {
    var ins = this, selector = this.selectors.productGroup, working = false;
    $(document).on('click', this.selectors.mediaBtn, function(e, currentImageId) {
      e.preventDefault();
      if(working) {
        return;
      }
      var pg = $(this).parents(selector.wrap), btn = $(this);
      if(currentImageId == undefined) {
        if(btn.attr('data-media-id') != undefined) {
          currentImageId = btn.attr('data-media-id');  
        } else {
          currentImageId = pg.find(selector.mainsSlider + ' .slick-current ' + selector.mainLink).attr('data-image-id');
        }
      }
      working = true;
      
      ins.startLoadingBtn(btn);
      ins.showLoadingFull();
      if(BT.data.cacheWindowWidth < 1200) {
        ins.loadSnippetAjax('photoswipe', function() {
          ins.loadCssJsLib('photoswipe', function() {
            setTimeout(function() {
              ins.endLoadingBtn(btn);
              ins.hideLoadingFull();
              ins.openLightboxByPhotoswipe(pg, currentImageId);
              working = false;
            }, 400);
          });
        }, 300);
      } else {
        ins.loadCssJsLib('lightgallery', function() {
          ins.endLoadingBtn(btn);
          ins.hideLoadingFull();
          ins.openLightboxByLightGallery(pg, currentImageId);
          working = false;
        });
      }
    });
  },

  initProductGlobal: function() {
    this.initMediaButton();
    this.initMainLightboxGallery();
    // Init click event for product thumbs
    var selector = this.selectors.productGroup, options = this.options.productGroup, ins = this;
    $(document).on('click', selector.thumbLink, function(e, fromMainSlider) {
      e.preventDefault();
      if($(this).parent().hasClass('active')) {
        return;
      }
      var currentThumbLink = $(this);
      var pg = currentThumbLink.parents(selector.wrap);
      if(e.originalEvent != undefined) {
        ins.updateMainThumbnail(pg, currentThumbLink);
      }
      currentThumbLink.parent().addClass('active').siblings('.active').removeClass('active');
    });
  }
});
BT.initProductGlobal();
theme.ProductModel = (function() {
  var modelJsonSections = {};
  var models = {};
  var xrButtons = {};

  var selectors = {
    mediaGroup: '[data-product-single-media-group]',
    xrButton: '[data-shopify-xr]'
  };

  function init(modelViewerContainers, sectionId) {
    modelJsonSections[sectionId] = {
      loaded: false
    };

    modelViewerContainers.each(function(index) {
      var $modelViewerContainer = $(this);
      var mediaId = $modelViewerContainer.data('media-id');
      var $modelViewerElement = $(
        $modelViewerContainer.find('model-viewer')[0]
      );
      var modelId = $modelViewerElement.data('model-id');

      if (index === 0) {
        var $xrButton = $modelViewerContainer
          .closest(selectors.mediaGroup)
          .find(selectors.xrButton);
        xrButtons[sectionId] = {
          $element: $xrButton,
          defaultId: modelId
        };
      }

      models[mediaId] = {
        modelId: modelId,
        sectionId: sectionId,
        $container: $modelViewerContainer,
        $element: $modelViewerElement
      };
    });

    window.Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: setupShopifyXr
      },
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: setupModelViewerUi
      }
    ]);
    BT.loadCssJsLib('modelViewerUiStyles');
  }

  function setupShopifyXr(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', function() {
        setupShopifyXr();
      });
      return;
    }

    for (var sectionId in modelJsonSections) {
      if (modelJsonSections.hasOwnProperty(sectionId)) {
        var modelSection = modelJsonSections[sectionId];

        if (modelSection.loaded) continue;
        var $modelJson = $('#ModelJson-' + sectionId);

        window.ShopifyXR.addModels(JSON.parse($modelJson.html()));
        modelSection.loaded = true;
      }
    }
    window.ShopifyXR.setupXRElements();
  }

  function setupModelViewerUi(errors) {
    if (errors) return;

    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (!model.modelViewerUi) {
          model.modelViewerUi = new Shopify.ModelViewerUI(model.$element);
        }
        setupModelViewerListeners(model);
      }
    }
  }

  function setupModelViewerListeners(model) {
    var xrButton = xrButtons[model.sectionId];
    model.$container.on('mediaVisible', function() {
      xrButton.$element.attr('data-shopify-model3d-id', model.modelId);
      if (BT.data.isTouchDevide) return;
      model.modelViewerUi.play();
    });

    model.$container
      .on('mediaHidden', function() {
        xrButton.$element.attr('data-shopify-model3d-id', xrButton.defaultId);
        model.modelViewerUi.pause();
      })
      .on('xrLaunch', function() {
        model.modelViewerUi.pause();
      });
  }

  function removeSectionModels(sectionId) {
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (model.sectionId === sectionId) {
          models[key].modelViewerUi.destroy();
          delete models[key];
        }
      }
    }
    delete modelJsonSections[sectionId];
  }

  return {
    init: init,
    removeSectionModels: removeSectionModels
  };
})();