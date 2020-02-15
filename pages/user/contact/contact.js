var api = require('../../data/data.js');
Page({
 
  data: {
    contactus: ''
  },
 
  onLoad: function (options) {
    var self = this;
    wx.request({
      url: api.api_list.get_aboutus,
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        var tmp = res.data.contactus;
        self.setData({
          contactus: tmp
        })
      }
    })
  },
  //分享
  onShareAppMessage: function (ops) {
    var path = "/pages/user/contact/contact";
    var openId = wx.getStorageSync('openId');
    return {
      title: "安法苑，法律法规任您看!",
      path: path + '?userOpenId=' + openId,
      imageUrl: '/image/share.png',
    }
  }
 })