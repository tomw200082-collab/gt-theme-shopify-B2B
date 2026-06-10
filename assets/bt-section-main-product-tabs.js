$.extend(true, BT, {
  initTabAccordion: function() {
    $(document).on('click', '.tab-accordion__trigger', (e) => {
      e.preventDefault();
      const btn = $(e.currentTarget);
      if(btn.hasClass('working')) {
        return;
      }
      btn.addClass('working');
      const newTabPane = $(btn.attr('href'));
      btn.toggleClass('open');
      
      if(btn.hasClass('open')) {
        newTabPane.slideDown(300, () => {
          btn.removeClass('working');
        });
      } else {
        newTabPane.slideUp(300, () => {
          btn.removeClass('working');
        });
      }
    });
    $(document).on('shown.bs.tab', '.tab-accordion-list a[data-toggle="tab"]', (e) => {
      const href = $(e.currentTarget).attr('href');
      const tabPane = $(href);
      tabPane.addClass('open').show();
      tabPane.siblings('.tab-accordion__trigger[href="' + href + '"]').addClass('open');
    });
    $(document).on('hidden.bs.tab', '.tab-accordion-list a[data-toggle="tab"]', (e) => {
      const href = $(e.currentTarget).attr('href');
      const tabPane = $(href);
      tabPane.removeClass('open').hide();
      tabPane.siblings('.tab-accordion__trigger[href="' + href + '"]').removeClass('open');
    });
  }
});
class MainProductTabsSection extends BTSection {
}
BT.initTabAccordion();
theme.sections.constructors['main-product-tabs'] = MainProductTabsSection;