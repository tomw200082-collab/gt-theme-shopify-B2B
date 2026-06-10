/********* --- About section --- *********/
class AboutSection extends BTSection {
  onInit() {
    BT.initSlider(this.container, true);
  }


  }
theme.sections.constructors['about'] = AboutSection;