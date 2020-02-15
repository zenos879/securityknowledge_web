var api = require('../data/data.js');
var app = getApp();
Page({
  data: {
    defaultAvatarUrl: "/image/main/default_avatar.png",
    defaultNickName: "用户名称",
    art_list: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    appid: 'wx9774987d567fd009',
    secret: '5b51058483d44f7ea4050e2de7783154',
    navHeight: 0,
    vipPeriod: 0
  },

  onLoad: function(options) {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: userInfo,
    });
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight;
        var clientWidth = res.windowWidth;
        var rpxR = 750 / clientWidth;
        var testHeight = clientHeight * 0.5 * rpxR;
        var navHeight = testHeight - 135;
        that.setData({
          navHeight: navHeight
        });
      }
    });
    that.getVIPperiod();
  },

  getVIPperiod: function() {
    var openId = wx.getStorageSync("openId");
    var that = this;
    var getVipleftday = api.api_list.get_vipperiod + "?openId=" + openId;
    api.http(getVipleftday, function (res) {
      that.setData({
        vipPeriod: res
      })
    })
  },

  setVIPperiod: function(openId) {
    var that = this;
    var url = api.api_list.update_vipperiod + "?openId=" + openId;
    api.http(url, function(res) {
      wx.setStorageSync("vip_left_day", res);
      that.setData({
        vipPeriod: res
      })
    });
  },

  encourageMe: function() {
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'pages/apps/largess/detail?id=nN72oYbnMLqgPc1CLmE7uw%3D%3D',
      //   envVersion: 'develop',
      success(res) {
        // 打开成功
        // console.log(res);
      }
    })
  },
  //客服
  handleContact(e) {
    // console.log(e.detail.path)
    // console.log(e.detail.query)
  },
  //打开新页面
  openNewPage: function(a) {
    api.openNewPage(a);
  },

  //分享
  onShareAppMessage: function(ops) {
    var that = this;
    var path = "/pages/home/home";
    var openId = wx.getStorageSync('openId');
    return {
      title: "安法苑，法律法规任您看!",
      path: path + '?userOpenId=' + openId,
      imageUrl: '/image/share.png'
    },
    that.setVIPperiod(openId);
  }



})