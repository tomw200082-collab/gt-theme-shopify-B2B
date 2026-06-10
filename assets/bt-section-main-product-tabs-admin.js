class MainProductTabsSectionAdmin extends MainProductTabsSection {
  onLoad(evt) {
    BT.runReLoadReview(this.container, true);
    BT.rteWrap(this.container.find('.rte'));
  }
  onBlockSelect(evt) {
    const tab = $(evt.target);
    let tabNav;
    if(BT.data.cacheWindowWidth <= 991) {
      tabNav = $('.tab-accordion__trigger[href="#' + tab.attr('id') + '"]');
      if(!tabNav.hasClass('open')) {
        tabNav.trigger('click');
      }
    } else {
      tabNav = $('.nav__link-single[href="#' + tab.attr('id') + '"]');
      if(!tabNav.parent().hasClass('active')) {
        tabNav.trigger('click');
      }
    }
    if(!BT.isInViewport(tabNav, evt.currentTarget.defaultView)) {
      const offset = tabNav.offset().top - 100;
      $('html, body').animate({
        scrollTop: offset
      }, 400);
    }
  }
}
theme.sections.constructors['main-product-tabs'] = MainProductTabsSectionAdmin;