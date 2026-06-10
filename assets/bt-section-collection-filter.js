var BTCollectionFilter = {
  selectors: {
    wrap: '.cfs',
    item: '.cfs__item',
    itemTitle: '.cfs__item__title',
    input: '.cfs__input',
    sectionContent: '.section__content',
    dropdown: '.cfs__dropdown',
    dropdownTrigger: '.cfs__dropdown__trigger',
    dropdownTriggerTitle: '.cfs__dropdown__title',
    dropdownTriggerValue: '.cfs__dropdown__value',
    dropdownTriggerTitleTopClass: 'cfs__dropdown__title--top',
    dropdownContent: '.cfs__dropdown__content',
    btn: '.cfs__btn'
  },

  renderData: function(wrap, cb){
    wrap.addClass('rendering');
    BT.showLoadingFull();
    var params = {view: 'filter'};
    var url = theme.collectionAllUrl;
    if(wrap.find('form').length > 0) {
      const formData = new FormData(wrap.find('form').first()[0]);
      const searchParams = new URLSearchParams(formData).toString();
      url += '?' + searchParams;
    }
    BT.callAjax(url, 'get', params, null, function(html) {
      var ajaxContent = $(this.selectors.sectionContent, html);
      wrap.find(this.selectors.sectionContent).html(ajaxContent.html());
      wrap.removeClass('rendering');
      BT.hideLoadingFull();
      if(cb) {
        cb();
      }
    }.bind(this));
  },

  init: function() {
    var ins = this, activeClass = 'active';
    $(document).on('change', this.selectors.input, function(e) {
      e.preventDefault();
      var wrap = $(this).parents(ins.selectors.wrap).first();
      if(!wrap.hasClass('rendering')) {
        var item = $(this).parents(ins.selectors.item).first();
        item.nextAll().each(function() {
          $(this).find('input[type="radio"]').prop('checked', false);
        });
        ins.renderData(wrap);
      }
    });
    $(document).on('click', this.selectors.dropdownTrigger, function(e) {
      var dropdown = $(this).parent(ins.selectors.dropdown);
      if(!dropdown.hasClass(activeClass)) {
        dropdown.addClass(activeClass);
      }
    });
    $(document).on('click', 'body', function(e) {
      if($(e.target).parents(ins.selectors.dropdown).length == 0 && !$(e.target).hasClass(ins.selectors.btn.replace('.',''))) {
        if($(ins.selectors.dropdown + '.' + activeClass).length > 0) {
          $(ins.selectors.dropdown + '.' + activeClass).removeClass(activeClass);
        }
      }
    });
    $(document).on('click', this.selectors.btn, function(e) {
      e.preventDefault();
      var wrap = $(this).parents(ins.selectors.wrap);
      var items = wrap.first().find(ins.selectors.item);
      var completed = true;
      items.each(function() {
        if($(this).find('.' + ins.selectors.dropdownTriggerTitleTopClass).length == 0) {
          $(this).find(ins.selectors.dropdown).addClass(activeClass);
          completed = false;
          return;
        }
      });
      if(completed) {
        wrap.find('form').first().submit();
      }
    });
  }
};
BTCollectionFilter.init();

class CollectionFilterSection extends BTSection {
  onInit() {
    BTCollectionFilter.renderData(this.container);
  }

  }


theme.sections.constructors['collection-filter'] = CollectionFilterSection;