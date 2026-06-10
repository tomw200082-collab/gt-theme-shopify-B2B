class VerticalNavigationSection extends BTSection {
  onInit() {
    BT.initDesktopNavigation(this.container, 'verticalNav');
  }
}
theme.sections.constructors['navigation-vertical'] = VerticalNavigationSection;
