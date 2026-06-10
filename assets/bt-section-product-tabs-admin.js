class ProductTabsSectionAdmin extends ProductTabsSection {
  onBlockSelect(evt) {
    var tab = $(evt.target);
    if(!tab.hasClass('active')) {
      var tabNav = $('a[href="#' + tab.attr('id') + '"]');
      tabNav.trigger('click');
    }
    if(!BT.isInViewport(this.container, evt.currentTarget.defaultView)) {
      var offset = this.container.offset().top - 100;
      $('html, body').animate({
        scrollTop: offset
      }, 400);
    }
  }

  onUnload(evt) {
    BT.unLoadProductTabs(this.container);
  }
}

theme.sections.constructors['product-tabs'] = ProductTabsSectionAdmin;