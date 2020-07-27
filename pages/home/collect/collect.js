var api = require('../../data/data.js');
const app = getApp();
Page({
  data: {
    listItems: {},
    collection_list: {},
    noContent: false,
    noContentToast: '',
    notLogin: false,
    notvip: false
  },

  onLoad: function(options) {
    api.showLoading("正在加载...");
    var collection_list = wx.getStorageSync("collection_list");
    if (collection_list && collection_list.length > 0) {
      var artIds = collection_list.join(",");
      var url = api.api_list.get_article_title_api + artIds;
      api.http(url, this.processCollect);
    } else {
      this.setData({
        noContent: true,
        noContentToast: "您还没有收藏的「法律法规」哦，快去点击小星星，添加收藏吧 ^_^..."
      })
    }
    api.hideLoading();
  },

  //处理收藏结果
  processCollect: function(res) {
    var self = this;
    var listItems = res;
    wx.setStorageSync("listItems", listItems);
    api.convertCollectListToListItmes();
    var collection_list = wx.getStorageSync("collection_list");
    listItems = wx.getStorageSync("listItems");
    self.setData({
      listItems: listItems,
      collection_list: collection_list
    })
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
    self.onLoad();
  },

  //打开文章
  openArticle: function(e) {
    api.openArticle(e);
  },


  //打开页面
  openPage: function (a) {
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
    } else {//然后看是否vip
      api.ifVip(function (notvip) {
        that.setData({
          notvip: notvip
        })
      });
    }
  },

  //获取用户数据
  bindGetUserInfo: function (e) {
    var that = this;
    api.bindGetUserInfo(e, function (notLogin) {
      that.setData({
        notLogin: notLogin
      })
      api.ifVip(function (notvip) {
        that.setData({
          notvip: notvip
        })
      });
    });
  },
  
    //分享
  onShareAppMessage: function (ops) {
    var path = "/pages/home/collect/collect";
    var openId = wx.getStorageSync('openId');
    return {
      title: "安法苑，法律法规任您看!",
      path: path + '?userOpenId=' + openId,
      imageUrl: '/image/share.png',
    }
    this.setData({
    notvip: data
  })
  }
})