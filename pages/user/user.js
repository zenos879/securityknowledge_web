var api = require('../data/data.js');
var app = getApp();
Page({
  data: {
    defaultAvatarUrl: "/image/default_avatar.png",
    defaultNickName: "请登录",
    art_list: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    appid: 'wx9774987d567fd009',
    secret: '5b51058483d44f7ea4050e2de7783154',
    navHeight: 0,
    vipPeriod: 0,
    visiter: true,
    notLogin: false,
    notvip: false
  },

  onLoad: function(options) {
    var that = this;
    that.checkLogin();

    //设置样式
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
  },

  loginTap: function() {
    this.setData({
      notLogin: true
    })
  },

  checkLogin: function() {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    if (userInfo && userInfo != null) { //已经登陆的状态
      that.setData({
        visiter: false,
        userInfo: userInfo
      })
      that.getVIPperiod();
    } else { //未登陆的状态，设置默认头像
      var userInfo = {};
      userInfo.avatarUrl = that.data.defaultAvatarUrl;
      that.setData({
        userInfo: userInfo,
      });
    }
  },

  //获得vip期限
  getVIPperiod: function() {
    var that = this;
    var openId = wx.getStorageSync("openId");
    if (openId != null && openId != '') {
      var getVipleftday = api.api_list.get_vipperiod + "?openId=" + openId;
      api.http(getVipleftday, function(res) {
        console.log(res);
        that.setData({
          vipPeriod: res
        })
      })
    } else {
      that.setData({
        vipPeriod: 0
      })
    }
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

  // //给我点赞
  // encourageMe: function() {
  //   wx.navigateToMiniProgram({
  //     appId: 'wx18a2ac992306a5a4',
  //     path: 'pages/apps/largess/detail?id=nN72oYbnMLqgPc1CLmE7uw%3D%3D',
  //     //   envVersion: 'develop',
  //     success(res) {
  //       // 打开成功
  //       // console.log(res);
  //     }
  //   })
  // },

  //客服
  handleContact(e) {
    // console.log(e.detail.path)
    // console.log(e.detail.query)
  },

  //打开新页面
  openNewPage: function(a) {
    var visiter = this.data.visiter;
    if (visiter) {
      this.setData({
        notLogin: true
      })
      var url = a.currentTarget.dataset.url;
      wx.setStorageSync("user-url", url);
    } else {
      api.openNewPage(a);
    }
  },

  //获取用户数据
  bindGetUserInfo: function(e) {
    var that = this;
    api.bindGetUserInfo(e, function(notLogin) {
      var userInfo = wx.getStorageSync("userInfo");
      that.setData({
        notLogin: notLogin,
        userInfo: userInfo,
        visiter: false
      })
      that.getVIPperiod();

      var url = wx.getStorageSync("user-url");
      if (url && url != null && url.length > 0) {
        wx.navigateTo({
          url: url,
        })
      }
    });
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
  },

  //分享到朋友圈
  onShareTimeline: function(res) {
    return {
      title: '安全生产法律法规，随你看！',
      query: '我是带的参数'
    }
  }
})