class LayerBannerTextSectionAdmin extends LayerBannerTextSection {
  onBlockSelect(evt) {
    var ele = $(evt.target);
    var slider = this.slider;
    var bannerItem = ele.hasClass('banner-item') ? ele : ele.parents('.banner-item');
    if(slider.hasClass('slick-initialized')) {
      if(!ele.hasClass('slick-current') && !ele.parents('.banner-item').hasClass('slick-current')) {
        var newIndex = bannerItem.attr('data-slick-index');
        slider.slick('slickGoTo', newIndex, true);
      }
      slider.slick('slickPause');
    } else {
      if(!BT.isInViewport(bannerItem, evt.currentTarget.defaultView)) {
        var offset = bannerItem.offset().top - 100;
        $('html, body').animate({
          scrollTop: offset
        }, 400);
      }
    }
  }

  onBlockDeselect() {
    // Resume auto-rotate
    if(this.slider.hasClass('slick-initialized')) {
      this.slider.slick('slickPlay');
    }
  }

  onUnload() {
    BT.destroySlider(this.container);
    BT.destroyDealCountdown(this.container);
  }
}

theme.sections.constructors['layer-banner'] = LayerBannerTextSectionAdmin;