var api = require('../../data/data.js');
const app = getApp();
Page({

  data: {
    aboutus: []
  },

  onLoad: function(options) {
    var self = this;
    var url = api.api_list.get_aboutus;
    api.http(url,this.processAboutUs);
  },
  processAboutUs:function(res){
    var self = this;
    var tmp = res.aboutus.split("<br>");
    self.setData({
      aboutus: tmp
    })
  },
  //分享
  onShareAppMessage: function (ops) {
    var path = "/pages/user/about/about";
    var openId = wx.getStorageSync('openId');
    return {
      title: "安法苑，法律法规任您看!",
      path: path + '?userOpenId=' + openId,
      imageUrl: '/image/share.png',
    }
  },

  //分享到朋友圈
  onShareTimeline: function (res) {
    return {
      title: '安全生产法律法规，随你看！',
      query: '我是带的参数'
    }
  }

})