theme.SingleDealSection.prototype = _.assignIn({}, theme.SingleDealSection.prototype, {
  onUnload: function() {
    BT.destroyScrollingWindowTriggerOnce(this.suffixEvent);
    BT.destroyDealCountdown(this.wrap);
    delete this.suffixEvent;
    delete this.wrap;
  }
});