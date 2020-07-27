var api = require('../../data/data.js')
const app = getApp();
Page({

  data: {
    hotItems: []
  },


  onLoad: function(options) {

    //获取热门标签
    var hotItems = wx.getStorageSync("hottag");
    if (hotItems && hotItems.length > 0) {
      this.setData({
        hotItems: hotItems
      })
    } else {
      var url = api.api_list.get_hot_tag;
      api.http(url, this.loadHottag);
    }

  },
  loadHottag: function(res) {
    console.log(res);
    var self = this;
    wx.setStorageSync("hottag", res);
    self.setData({
      hotItems: res
    })
  },

  //跳转到文章列表页
  gotoAbstract: function(e) {
    var catId = e.currentTarget.dataset.catid;
    var catName = e.currentTarget.dataset.cname;
    var catDesc = e.currentTarget.dataset.cdesc;
    wx.setStorageSync('catId', catId);
    wx.setStorageSync('catName', catName);
    wx.setStorageSync('catDesc', catDesc);
    console.log(catId);
    wx.navigateTo({
      url: '/pages/category/articleList/articleList',
    })
  },


  //分享
  onShareAppMessage: function(ops) {
    var path = "/pages/home/hottag/hottag";
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