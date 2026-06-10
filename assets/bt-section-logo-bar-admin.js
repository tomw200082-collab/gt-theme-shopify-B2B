class LogoListSectionAdmin extends LogoListSection {
  onBlockSelect(evt) {
    var ele = $(evt.target);
    var slideEle = ele.hasClass('slick-slide') ? ele : ele.parents('.slick-slide').first();
    if(!slideEle.hasClass('slick-current')) {
      this.slider.slick('slickGoTo', slideEle.attr('data-slick-index'), true);
    }
    this.slider.slick('slickPause');
  }
  onBlockDeselect() {
    if(this.slider.hasClass('slick-initialized')) {
      this.slider.slick('slickPlay');
    }
  }
  onUnload() {
    BT.destroySlider(this.container);
  }
}
theme.sections.constructors['logo-bar'] = LogoListSectionAdmin;