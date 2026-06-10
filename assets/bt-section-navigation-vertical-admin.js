class VerticalNavigationSectionAdmin extends VerticalNavigationSection {
  getTopEle(ele) {
    return ele.hasClass('nav__item') ? ele : ele.parents('.nav__item');
  }
  onSelect(evt) {
    var ele = $(evt.target);
    ele.children('.vertical-navigation__trigger').trigger('click');
  }

  onDeselect(evt) {
    var ele = $(evt.target);
    ele.children('.vertical-navigation__trigger').trigger('click');
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
theme.sections.constructors['navigation-vertical'] = VerticalNavigationSectionAdmin;
