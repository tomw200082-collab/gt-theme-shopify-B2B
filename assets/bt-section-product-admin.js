class ProductTemplateSectionAdmin extends ProductTemplateSection {
  onLoad(evt) {
    BT.runReLoadReview(this.container, true);
    BT.rteWrap(this.container.find('.rte'));
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    $(evt.target).find('.product-single,.sc').removeAttr('data-history');
  }
  onBlockSelect(evt) {
    var tabNav = $(evt.target);
    if(!tabNav.hasClass('open')) {
      tabNav.trigger('click');
    }
    if(!BT.isInViewport(tabNav, evt.currentTarget.defaultView)) {
      var offset = tabNav.offset().top - 100;
      $('html, body').animate({
        scrollTop: offset
      }, 400);
    }
  }
  onUnload() {
    theme.ProductModel.removeSectionModels(this.sectionId);
  }
}
theme.sections.constructors['product'] = ProductTemplateSectionAdmin;