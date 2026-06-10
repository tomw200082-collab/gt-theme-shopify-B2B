/********* --- Mobile Navigation --- *********/
class MobileNavigationSection extends BTSection {
  hasOpenedSidebarMenu() {
    return $('body').hasClass('open-sidebar-canvas--sidebar-mobile-nav');
  }

  openSidebarMenu() {
    if(!this.hasOpenedSidebarMenu() && BT.data.cacheWindowWidth <= BT.options.windowScreen.mobile) {
      $('.mobile-nav-bar').trigger('click');
    }
  }

  toggleSubItem(ele, action) {
    if(ele.hasClass('mobile-nav__item--parent')) {
      if((action == 'open' && !ele.hasClass('open')) || (action == 'close' && ele.hasClass('open'))) {
        ele.find('.mobile-nav__top-link-wrap .mobile-nav__arrow').trigger('click');  
      }
    }
  }

  onSelect(evt) {
    if(BT.data.cacheWindowWidth > BT.options.windowScreen.mobile) {
      BT.showNotify('Please adjust to the mobile screen to see the changes.', BT.options.notifyClassTypes.danger);
    } else {
      this.openSidebarMenu();
    }
  }

  onBlockSelect(evt) {
    this.openSidebarMenu();
    var ele = $(evt.target);
    this.toggleSubItem(ele, 'open');
  }

  onBlockDeselect(evt) {
    var ele = $(evt.target);
    this.toggleSubItem(ele, 'close');
  }
}
theme.sections.constructors['navigation-mobile'] = MobileNavigationSection;