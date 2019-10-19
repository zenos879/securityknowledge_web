var e = require("../../utils/util.js"),
  time = require('../../utils/util.js'),
  api = require('../data/data.js');
var app = getApp();
Page({
  data: {
    defaultAvatarUrl: "/images/main/default_avatar.png",
    defaultNickName: "用户名称",
    presentCount: 0,
    practiceday: '',
    studytime: '',
    practicetime: "",
    today_s: "",
    vip: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    art_list: []
  },

  onLoad: function(options) {
    var that = this,
      userInfo = wx.getStorageSync("_userInfo");
    var userNid = wx.getStorageSync("unionid");
    wx.request({ //位登录
      url: app.globalData.Url + '/api/login/event/userinfo/',
      data: {
        unionid: userNid,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        console.log('----用户信息', res)
        if (res.data.data.utype == 2) {
          res.data.data.uvipdaoqi = time.toDate(res.data.data.uvipdaoqi)
          that.setData({
            vip: true,
            vip_time: res.data.data.uvipdaoqi,
          })
        } else if (res.data.data.utype == 1) {
          console.log(res.errMsg)
          that.setData({
            vip: false,
          })
        }
        that.setData({
          male: res.data.data.usex
        })
      },
    })
    that.setData({ //转换完毕存储
      userInfo: userInfo,
    })
    wx.getSystemInfo({
      success: function(res) {
        var windowWidth = res.windowWidth * 0.5;
        that.setData({
          //圆点坐标,x为屏幕一半,y为半径与margin-top之和,px
          //后面获取的触摸坐标是px,所以这里直接用px.
          dotPoint: {
            clientX: windowWidth,
            clientY: 250
          }
        })
      }
    })
  },

  onReady: function() {},
  openPage: function(a) {
    var e = a.currentTarget.dataset.url;
    wx.navigateTo({
      url: e
    });
  },


  myCollections: function() {
    var self = this;
    var artid_list = [];
    var collection_list = wx.getStorageSync("collection_list");
    for (var index in collection_list) {
      if (collection_list[index]) {
        artid_list.push(index);
      }
    }
    wx.request({
      url: api.api_list.get_article_title_api,
      method: 'GET',
      success: function(res) {
        self.setData({
          art_id_title_list: res.data
        })
      }
    })
  }
})