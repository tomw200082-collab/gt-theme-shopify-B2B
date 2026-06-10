class InstagramSection extends BTSection {
  onInit() {
    BT.initSlider(this.container, true, false);
  }
}
theme.sections.constructors['instagram'] = InstagramSection;