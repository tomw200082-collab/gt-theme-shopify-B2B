class ProductColumnsSection extends BTSection {
  onInit() {
    if(!this.container.hasClass('load-product-columns-ajax')) {
      BT.addProductMetaData(this.container, false);
      BT.initSlider(this.container, false, false);
    } else {
      BT.loadProductColumnsAjax(this.container);
    }    
  }
}
theme.sections.constructors['product-columns'] = ProductColumnsSection;