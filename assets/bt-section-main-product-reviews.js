class MainProductReviewsSection extends BTSection {
  onLoad(evt) {
    BT.runReLoadReview(this.container, true);
  }
}
theme.sections.constructors['main-product-reviews'] = MainProductReviewsSection;