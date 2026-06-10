class FooterSectionAdmin extends FooterSection {
  onLoad(evt) {
    BT.reLoadReview(this.container);
    BT.convertCurrencySilence(this.container.find('span.money'));
  }
};
theme.sections.constructors['footer'] = FooterSectionAdmin;