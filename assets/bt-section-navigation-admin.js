class DesktopNavigationSectionAdmin extends DesktopNavigationSection {
  getTopEle(ele) {
    return ele.hasClass('nav__item') ? ele : ele.parents('.nav__item');
  }
  onBlockSelect(evt) {
    var ele = $(evt.target);
    var topEle = this.getTopEle(ele);
    if(topEle.length > 0) {
      topEle.addClass('open');
    }
  }
  onBlockDeselect(evt) {
    var ele = $(evt.target);
    var topEle = this.getTopEle(ele);
    if(topEle.length > 0) {
      topEle.removeClass('open');
    }
  }
}

theme.sections.constructors['navigation'] = DesktopNavigationSectionAdmin;