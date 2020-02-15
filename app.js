//app.js
App({
  onLaunch: function(options) {
    var that = this;
    //console.log(options);
    var shareTicket = options.shareTicket;
    if (shareTicket) {
      wx.getShareInfo();
      //显示提示框
      wx.showToast({
        title: shareTicket,
        duration: 5000,
        icon: 'success'
      })
    }
  },
  globalData: {
    isvip:true
  }
})