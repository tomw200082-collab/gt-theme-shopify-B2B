var BTCollection = {
	selectors: {
		section: '.collection-template-section',
		filter: '.cf',
		filterContent: '.cf__content',
		filterForm: '.cf__form',
		filterLink: '.cf__link',
		filterInput: '.cf__link__input',
		filterPriceSlider: '.cf__price-slider',
		filterPriceFrom: '.cf__price-from',
		filterPriceTo: '.cf__price-to',
		filterPriceInputMin: '.cf__price-input-min',
		filterPriceInputMax: '.cf__price-input-max',
		filterCurrentInline: '.cf__current-inline',
		sortInput: '.cf__sort-by',
		sortLink: '.ct__sort__link',
		products: '.collection__products',
		currentTags: '.collection__current-tags',
		productsInner: '.products',
		modeLink: '.ct__mode__link',
		sort: '.ct__sort',
		total: '.ct__total',
		pagination: '.pagination',
		scrollBtn: '.collection__scroll',
		paginationButton: '.collection__scroll,.button--more,.pagination',
		productGrid: '.grid--products',
		productItem: '.grid__item',
		recentViewWrap: '.cf__item--recent-view',
		recentViewList: '.cf__item--recent-view__content',
		wrap: '#collection-template'
	},

	options: {
		clickEvent: 'click',
		ajaxView: 'ajax'
	},

	data: {
		collectionUrl: '',
		priceSlider: []
	},

	ignoreViewParam: function(str) {
		if(str != '' && str != undefined) {
			str = str.replace(/\?view=ajax\"/g,'"').replace(/\?view=ajax\&/g,'?').replace(/\&view=ajax/g,'');
		}
		return str;
	},

	updateHtml: function(html) {
		var selector = this.selectors;
		var filterStr = $(selector.filter, html).html();
		var section = $(selector.section);
		if($(selector.scrollBtn).length > 0) {
			this.destroyInfiniteScroll();
		}
		section.html($(selector.section, html).html());
		BT.reLoadReview(selector.productGrid);
		BtCurrency.convertSilence(shopCurrency, BtCurrency.currentCurrency, $(selector.wrap).find('span.money'));
		BT.applyCustomColorSwatches(selector.products);
		BT.applyCustomColorSwatches(selector.filter);
		BT.initDealCountdown(selector.products);
		BT.popularAddedWishlistItems(selector.products);
		this.updateTotalValuesNumber();
		// Remove old current inline
		
		if(section.offset().top < $(window).scrollTop()) {
			$('html, body').animate({
        scrollTop: (section.offset().top - 100)
      }, 400);
		}

		this.loadRecentViewProducts();

		if($(selector.scrollBtn).length > 0) {
			this.initInfiniteScrollCollection(selector.products);
		}
	},

	resetPricesliders: function() {
		$.each(this.data.priceSlider, function(index, slider){
			var sliderIns = $(slider);
			slider.noUiSlider.updateOptions({start:[sliderIns.attr('data-min'), sliderIns.attr('data-max')]}, true);
		});
	},

	initPriceSliders: function() {
		var ins = this;
		// Destroy old slider
		$.each(this.data.priceSlider, function(index, slider){
			slider.noUiSlider.destroy();
		});
		this.data.priceSlider = [];
		$(this.selectors.filterPriceSlider).each(function() {
			var ele = $(this);
			var cfContent = ele.parents(ins.selectors.filterContent);
			var slider = document.getElementById(ele.attr('id'));
			var start = $(this).attr('data-start')*1;
			var end = $(this).attr('data-end')*1;
			var min = $(this).attr('data-min')*1;
			var max = $(this).attr('data-max')*1;
			noUiSlider.create(slider, {
		    connect: [false, true, false],
		    start: [start, end],
		    range: {
		        'min': min,
		        'max': max
		    },
		    step: 1,
		    format: {
		    	from: function(value) {
		    		return Math.round(value);
		    	},
		    	to: function(value) {
		    		return Math.round(value);
		    	}
		    },
		    direction: (rtl ? 'rtl' : 'ltr')
			});
			slider.noUiSlider.on('update', function(values, handle, unencoded, tap, positions, noUiSlider) {
				ele.parent().find(ins.selectors.filterPriceFrom).html(BT.getPriceHtml(values[0]*100));
				ele.parent().find(ins.selectors.filterPriceTo).html(BT.getPriceHtml(values[1]*100));
				ele.siblings(ins.selectors.filterPriceInputMin).val(values[0]);
				ele.siblings(ins.selectors.filterPriceInputMax).val(values[1]);
				BtCurrency.convertSilence(shopCurrency, BtCurrency.currentCurrency, '.cf__price span.money');
			});
			slider.noUiSlider.on('change', function(values, handle, unencoded, tap, positions, noUiSlider) {
				if(BT.data.cacheWindowWidth > BT.options.windowScreen.mobile) {
					slider.setAttribute('disabled', true);
					ins.submitFilterForm(ele);
				}
				// ins.updateNewContent(ins.data.collectionUrl, ins.collectAutoFilterParams(cfContent, true), false, true);
			});
			ins.data.priceSlider.push(slider);
		});
	},

	addHistoryUrlToState: function(url, params) {
		if(this.inIframe()) {
			return;
		}
		try {
			var newUrl = this.ignoreViewParam(url), newParams;
			if(params != undefined && params != null) {
				newParams = new URLSearchParams(params);	
			} else {
				newParams = new URLSearchParams(window.location.search)
			}
			
			newParams.delete('section_id');
			// newParams.delete('view');
			var newParamsStr = newParams.toString();
			if(newParamsStr != '') {
				if(url.indexOf('?') < 0) {
					newUrl += '?';
				} else {
					newUrl += '&';
				}
				newUrl += newParamsStr;
			}
			window.history.pushState({path: newUrl}, '', newUrl);	
		} catch (e) {
			console.log(e);
		}
	},

	inIframe: function() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
	},

	updateNewContent: function(url, params, updateHistory) {
		BT.showLoadingFull();
		BT.callAjax(url, 'GET', params, null, function(html) {
			this.updateHtml(html);
			this.initPriceSliders();
			BT.hideLoadingFull();

			if(url.indexOf('/search?') < 0) {
				this.data.collectionUrl = url.split('?')[0];	
			}
			if(updateHistory) {
				// Update history
				this.addHistoryUrlToState(url, params);
			}
		}.bind(this));
	},

	getSectionId: function(ele) {
		return ele.parents(this.selectors.section).first().attr('data-section-id');
	},

	submitFilterForm: function(ele) {
		ele.parents(this.selectors.filterForm).first().submit();
	},

	hideFilterCanvasOnMobile: function() {
		if(BT.data.cacheWindowWidth < 1200 && $('body').hasClass('open-sidebar-canvas--sidebar-filter')) {
			$('#sidebar-filter .bt-sidebar__close').trigger('click');
		}
	},

	updateTotalValuesNumber: function() {
		var total = parseInt($('.filter-action-mobile__item--submit-btn').attr('data-total-active-values'));
		if(total > 0) {
			$('.filter-active-number').removeClass('hide').text(total);
		} else {
			$('.filter-active-number').addClass('hide');
		}
	},

	initAjaxLinkEvent: function() {
		var ins = this;
		$(document).on(this.options.clickEvent, this.selectors.filterLink, function(e) {
			e.preventDefault();
			var link = $(this);
			var href = link.attr('href');
			var params = {section_id: ins.getSectionId($(this))};
			ins.hideFilterCanvasOnMobile();
			ins.updateNewContent(href, params, true);			
		});
		$(document).on('change', this.selectors.filterInput, function(e) {
			e.preventDefault();
			if(BT.data.cacheWindowWidth > BT.options.windowScreen.mobile) {
				ins.submitFilterForm($(this));	
			}
		});
		$(document).on(this.options.clickEvent, this.selectors.sortLink, function(e) {
			e.preventDefault();
			$(ins.selectors.sortInput).val($(this).attr('data-value'));
			ins.submitFilterForm($(ins.selectors.sortInput));
		});
		$(document).on('submit', this.selectors.filterForm, function(e) {
			e.preventDefault();
			ins.hideFilterCanvasOnMobile();
			const formData = new FormData(e.target);
    	const searchParams = new URLSearchParams(formData).toString();
    	const sectionId = ins.getSectionId($(this));
    	const url = `${window.location.pathname}?${searchParams}`;
    	ins.updateNewContent(url, {'section_id': sectionId}, true);
		});
		this.updateTotalValuesNumber();
	},

	initPopState: function() {
		this.addHistoryUrlToState(window.location.pathname);
		$(window).bind("popstate", function(e) {
	    var state = e.originalEvent.state;
	    if ( state !== null ) { 
	      this.updateNewContent(state.path, {}, false);
	    }
		}.bind(this));
	},

	destroyInfiniteScroll: function() {
		BT.destroyInfiniteScroll('collection-template');
	},

	initInfiniteScrollCollection: function(wrap) {
		this.destroyInfiniteScroll();
		BT.initInfiniteScroll(wrap);
	},

	openCurrentFilterDropdown: function() {
		$('.cfc__link.active').each(function() {
			var link = $(this);
			link.parents('.cfc__dropdown').each(function() {
				var dropdown = $(this);
				dropdown.show();
				dropdown.parent('.link-list__item').addClass('open');
			});
		});
	},

	loadRecentViewProducts: function() {
		var wrap = $(this.selectors.recentViewWrap);
		if(wrap.length > 0) {
			var list = $(this.selectors.recentViewList);
			var handleItems = BT.getCookieItemsValue(true, BT.options.recentView.cookieName);
			if(handleItems.length > 0) {
				handleItems.reverse();
				var q = handleItems.join(',');
				BT.callAjax(theme.rootUrl, 'GET', {view:'recent_view_list', q: q}, null, function(html) {
		      list.html(html);
		      if(list.find('.item').length > 0) {
		        BT.convertCurrencySilence(list.find('span.money'));
		        BT.reLoadReview(list);
		        wrap.removeClass('hide');
		      }
		    });
			}
			
		}
	},

	init: function() {
		this.initAjaxLinkEvent();
		BT.initExpandTrigger();
		this.loadRecentViewProducts();
		this.initPopState();
		$(document).on('click', '.close-filter-btn', function(e) {
			e.preventDefault();
			$('#sidebar-filter .bt-sidebar__close').trigger('click');
		});
	}
}

class CollectionTemplateSection extends BTSection {
	onInit() {
		BTCollection.data.collectionUrl = this.container.attr('data-url');
  	BtCurrency.convertSilence(shopCurrency, BtCurrency.currentCurrency, this.container.find('span.money'));
    BTCollection.initInfiniteScrollCollection(this.container);
    BT.initDealCountdown(this.container.find(BTCollection.selectors.products));
    BTCollection.initPriceSliders();
    BT.applyCustomColorSwatches(this.container);
  }

	onUnload() {
    BTCollection.destroyInfiniteScroll();
  }
}

BTCollection.init();
theme.sections.constructors['collection-template'] = CollectionTemplateSection;