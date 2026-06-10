class FooterSection extends BTSection {
  onInit() {
    if($('.social-app').length > 0) {
      $('.social-app').each(function() {
        var ele = $(this);
        var suffixEvent = 'social_app_' + ele.attr('data-block-id');
        BT.initScrollingWindowTriggerOnce(ele, suffixEvent, -270, function() {
          if(ele.hasClass('social-app--fb')) {
            var dataAppId = ele.attr('data-app-id');
            if(dataAppId) {
              var url = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10&appId=" + dataAppId;
              (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = url;
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
            }
          } else {
            var script = document.createElement('script');
            script.src = "//platform.twitter.com/widgets.js";
            script.charset = "utf-8";
            script.async = true;
            document.getElementsByTagName('head')[0].appendChild(script);
          }
          setTimeout(function() {ele.removeClass('loading');},1000);
        });
      });
    }

    if(this.container.find('.pcol__items').length > 0) {
      if(Shopify.designMode) {
        BT.addProductMetaData(this.container, false);
      } else {
        this.container.addClass('load-product-columns-ajax');
        BT.loadProductColumnsAjax(this.container);
      }
    }

    if(theme.newsTerms && this.container.find('.newsletter--footer').length > 0) {
      this.container.find('.newsletter--footer').each(function() {
        BT.initNewsTerms('#' + $(this).attr('id'));
      });
    }
 
  }
}
theme.sections.constructors['footer'] = FooterSection;