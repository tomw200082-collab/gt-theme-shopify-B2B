/********* --- Newsletter Section --- *********/
class NewsletterSection extends BTSection {
  onInit() {
    BT.initNewsTerms('#' + this.container.attr('id'));
  }
}
theme.sections.constructors['newsletter'] = NewsletterSection;