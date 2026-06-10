/********* --- About section --- *********/
class FeaturedBlogSection extends BTSection {
  onInit() {
    BT.initSlider(this.container, true);
  }
  
  onUnload() {
    BT.destroySlider(this.container);
  }
}

theme.sections.constructors['featured-blog'] = FeaturedBlogSection;