var api = require('../../data/data.js');
Page({
  data: {
    listItems: [],
    history_list: [],
    collection_list: [],
    update_list: [],
    totalCount: 0,
    count: 20,
    notLogin: false,
    notvip: false
  },

  onLoad: function(options) {
    api.showLoading("正在加载...");
    var url = api.api_list.get_update_list + "?start=0&count=" + this.data.count;
    api.http(url, this.processUpdate);
  },

  //处理最新数据结果
  processUpdate: function(data) {
    var self = this;
    var totalCount = self.data.totalCount + 20;
    var listItems = self.data.listItems.concat(data);
    wx.setStorageSync("listItems", listItems);
    api.convertCollectListToListItmes();
    var collection_list = wx.getStorageSync("collection_list");
    listItems = wx.getStorageSync("listItems");
    this.setData({
      listItems: listItems,
      collection_list: collection_list,
      totalCount: totalCount
    })
    api.hideLoading();
    wx.hideNavigationBarLoading();
  },

  //上滑加载更多
  onReachBottom: function(event) {
    var catId = wx.getStorageSync('catId');
    var totalCount = this.data.totalCount;
    var nextUrl = api.api_list.get_update_list + "?start=" + this.data.totalCount + "&count=" + this.data.count;

    api.http(nextUrl, this.processUpdate)
    wx.showNavigationBarLoading()
  },

  //点击收藏
  onCollect: function(e) {
    var self = this;
    api.onCollect(e);
    var collection_list = wx.getStorageSync("collection_list");
    var listItems = wx.getStorageSync("listItems");
    self.setData({
      collection_list: collection_list,
      listItems: listItems
    })
  },

  //打开文章
  openArticle: function(e) {
    api.openArticle(e);
  },

  //打开页面
  openPage: function(a) {
    var that = this;
    var fileurl = a.currentTarget.dataset.url;
    var artid = a.currentTarget.dataset.artid;
    var artpath = a.currentTarget.dataset.artpath;
    wx.setStorageSync("fileurl", fileurl);
    wx.setStorageSync("artid", artid);
    wx.setStorageSync("artpath", artpath);

    //首先，看用户是否登录.如果没有没登录，拉起面板，让登录。
    var openId = wx.getStorageSync("openId");
    if (openId == null || openId.length == 0) {
      this.setData({
        notLogin: true
      })
    } else { //然后看是否vip
      api.ifVip(function(notvip) {
        that.setData({
          notvip: notvip
        })
      });
    }
  },

  //获取用户数据
  bindGetUserInfo: function(e) {
    var that = this;
    api.bindGetUserInfo(e, function(notLogin) {
      that.setData({
        notLogin: notLogin
      })
      api.ifVip(function(notvip) {
        that.setData({
          notvip: notvip
        })
      });
    });
  },

  //分享
  onShareAppMessage: function(ops) {
    var path = "/pages/home/update/update";
    var openId = wx.getStorageSync('openId');
    return {
      title: "安法苑，法律法规任您看!",
      path: path + '?userOpenId=' + openId,
      imageUrl: '/image/share.png',
    }
    this.setData({
      notvip: data
    })
  },

  //分享到朋友圈
  onShareTimeline: function (res) {
    return {
      title: '安全生产法律法规，随你看！',
      query: '我是带的参数'
    }
  }
})