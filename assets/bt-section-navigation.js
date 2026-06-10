$.extend(true, BT, {
  /* Desktop Navigation */
  data: {
    desktopNav: {
      loadedDropdown: Shopify.designMode,
      resetWithData: false
    },
    verticalNav: {
      loadedDropdown: Shopify.designMode,
      resetWithData: false
    }
  },
  alignDropdown: function(wrap, type) {
    const selectors = this.selectors[type]
    if(type == 'desktopNav') { // Horizontal navigation
      if(this.data.cacheWindowWidth >= this.options.windowScreen.desktop && this.data[type].loadedDropdown == true) {
        var parentItems = wrap.find(selectors.parentItem);
        if(parentItems.length > 0) {
          var parentNav = $(selectors.parentNav);
          var thresholdLeft = parentNav.offset().left;
          var thresholdRight = thresholdLeft + parentNav.outerWidth();
        parentItems.each((indexParent, parentItemEle) => {
          const parentItem = $(parentItemEle);
          const dropdown = parentItem.children(selectors.dropdown);
          dropdown.css({ 'left' : '', 'right' : '' });
          
          var centerPoint = parentItem.offset().left + parentItem.outerWidth()/2;
            var dropdownWidth = dropdown.outerWidth();
            var dropdownHalf = dropdownWidth/2;
            if(!rtl) {
              var leftPoint = parentItem.offset().left;
              if(leftPoint + dropdownWidth > thresholdRight) {
                if(centerPoint + dropdownHalf < thresholdRight) {
                  if(centerPoint - dropdownHalf > thresholdLeft) {
                    var left = centerPoint - dropdownHalf - thresholdLeft - 15;
                    dropdown.css({'left': left});
                  } else {
                    dropdown.css({'left': 0});
                  }
                } else {
                  dropdown.css({'right': 0, 'left': 'auto'});
                }
              } else {
                dropdown.css({'left': (leftPoint - thresholdLeft - 15)});
              }
            } else {
            var rightPoint = parentItem.offset().left + parentItem.outerWidth();
              if(rightPoint - dropdownWidth < thresholdLeft) {
                if(centerPoint - dropdownHalf > thresholdLeft) {
                  if(centerPoint + dropdownHalf > thresholdRight) {
                    dropdown.css({'left': 0});
                  } else {
                    var left = centerPoint - dropdownHalf - thresholdLeft + 15;
                    dropdown.css({'left': left});
                  }
                } else {
                  dropdown.css({'left': 0, 'right': 'auto'});
                }
              } else {
                dropdown.css({'left': (rightPoint - thresholdLeft - dropdownWidth + 15)});
              }
            }
          });
        }
      }
    } else {
      if(this.data.cacheWindowWidth >= this.options.windowScreen.desktop) {
        const parentItems = wrap.find(selectors.parentItem + ' > a');
        if(parentItems.length > 0) {
          const parentNav = $(selectors.parentNav);
          const thresholdTop = parentNav.offset().top;
          parentItems.each((indexParent, parentItemEle) => {
            const parentItem = $(parentItemEle);
            const dropdown = parentItem.siblings(selectors.dropdown);
            dropdown.css("top","");
            const centerPoint = parentItem.offset().top + parentItem.outerHeight()/2;
            const dropdownHalf = dropdown.outerHeight()/2;
            if(centerPoint - dropdownHalf > thresholdTop) {
              const top = centerPoint - dropdownHalf - thresholdTop;
              dropdown.css({'top': top});
            } else {
              dropdown.css({'top': 0});
            }
          });
        }
      }
    }
  },
  hideOpeningMenu: function(wrap) {
    wrap.find('.nav__item--parent').removeClass('hover clicked');
  },
  initHoverMenu: function(wrap, type) {
      if(type != 'desktopNav') { // Init trigger button in the vertical navigation
        $('.vertical-navigation__trigger').unbind('click');
      $('.vertical-navigation__trigger').on('click', (e) => {
          e.preventDefault();
        $(e.currentTarget).toggleClass('open');
        $(e.currentTarget).siblings('.vertical-navigation__inner').toggleClass('open');
        });
      }
    const wrapId = '#' + wrap.attr('id');
    $(document).on('mouseover', wrapId + ' .nav__item--parent:not(.hover),' + wrapId + ' .link-list__item--parent:not(.hover)', (e) => {
        e.preventDefault();
      $(e.currentTarget).siblings('.hover').removeClass('hover');
      $(e.currentTarget).addClass('hover');
      this.data.openingDesktopNav = true;
      });

    $(document).on('mouseout', wrapId + ' .nav__item--parent.hover,' + wrapId + ' .link-list__item--parent.hover', (e) => {
        e.preventDefault();
      $(e.currentTarget).removeClass('hover clicked');
      this.data.openingDesktopNav = false;
      });
      

      // Show dropdown in tablet
    const parentItemSelector = '.navigation__item--parent';
    $(document).on('click', wrapId + ' .nav__item--parent:not(clicked) > a,' + wrapId + ' .link-list__item--parent:not(clicked) > div > a', (e) => {
      if(this.data.cacheWindowWidth >= 992 && this.data.cacheWindowWidth <= 1199) {
        if(!$(e.currentTarget).closest(parentItemSelector).hasClass('clicked')) {
            e.preventDefault();
          $(e.currentTarget).closest(parentItemSelector).siblings('.clicked').removeClass('hover clicked');
          $(e.currentTarget).closest(parentItemSelector).addClass('clicked hover');//.trigger("mouseover");
          $(e.currentTarget).addClass('test');
          this.data.openingDesktopNav = true;
          }
        }
      });
  },
  resetNavWithData: function(wrap, type) {
    this.alignDropdown(wrap, type);
    this.initHoverMenu(wrap, type);
    this.initDealCountdown(wrap);
    this.data[type].resetWithData = true;
  },

  resetNavData: function(wrap, type) {
    if(this.data.cacheWindowWidth >= 992) {
      if(this.data[type].loadedDropdown) {
        this.resetNavWithData(wrap, type);
        } else {
        this.runLoadingDropdownNavInAjax(wrap, type, () => {
          this.data[type].loadedDropdown = true;
          this.resetNavWithData(wrap, type);
          });
        }
      }
  },
  initDesktopNavigation: function(wrap, type) {
    const selectors = this.selectors[type];
    if(wrap.length > 0) {
      this.resetNavData(wrap, type);
      
      $(window).on(this.data.resizeEventName, (e) => {
        if(!$('body').hasClass('modal-open')) {
          setTimeout(() => {
            this.resetNavData(wrap, type);
          }, 1000);  
        }
      });
    }
  }
});

/********* --- Desktop Navigation --- *********/
class DesktopNavigationSection extends BTSection {
  onInit() {
    BT.initDesktopNavigation(this.container, 'desktopNav');
  }
}
theme.sections.constructors['navigation'] = DesktopNavigationSection;