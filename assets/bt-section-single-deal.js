/********* --- Single Deal --- *********/
class SingleDealSection extends BTSection {
  onInit() {
    this.suffixEvent = 'single_deal_' + this.sectionId;

    BT.initScrollingWindowTriggerOnce(this.container, this.suffixEvent, -170, () => {
      BT.initDealCountdown(this.container);
    });
  }

  onUnload() {
    BT.destroyScrollingWindowTriggerOnce(this.suffixEvent);
    BT.destroyDealCountdown(this.container);
  }
}
theme.sections.constructors['single-deal'] = SingleDealSection;