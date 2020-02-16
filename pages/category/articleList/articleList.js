var api = require('../../data/data.js');
Page({
  data: {
    listItems: [],
    catId: '',
    catName: '',
    catDesc: '',
    curIndex: 0,
    art_cnt: '',
    collection_list: '',
    totalCount: 0,
    count: 20,
    notLogin: false,
    notvip: false
  },

  onLoad: function(options) {
    api.showLoading("正在加载...");
    var catId = wx.getStorageSync('catId');
    var url = api.api_list.get_article_list_api + catId + "&start=0&count=" + this.data.count;
       api.http(url, this.processArtList);
    url = api.api_list.get_article_list_api + catId + "&start=0&count=0";
    api.http(url, this.setTotalCnt);
  },

  setTotalCnt: function(artCnt) {
    this.setData({
      art_cnt: artCnt
    })
    var catName = wx.getStorageSync('catName');
    wx.setNavigationBarTitle({
      title: "「" + catName + "」 已收录 " + artCnt + " 部",
    })
  },

  //请求成功后，处理数据
  processArtList: function(data) {
    var self = this;
    var listItems = self.data.listItems.concat(data);
    var catId = wx.getStorageSync('catId');
    var catName = wx.getStorageSync('catName');
    var catDesc = wx.getStorageSync('catDesc');
    var totalCount = self.data.totalCount + self.data.count;
    wx.setStorageSync("listItems", listItems);
    api.convertCollectListToListItmes();
    var collection_list = wx.getStorageSync("collection_list");
    listItems = wx.getStorageSync("listItems");
    self.setData({
      collection_list: collection_list,
      listItems: listItems,
      catId: catId,
      catName: catName,
      catDesc: catDesc,
      totalCount: totalCount
    })

    api.hideLoading();
    wx.hideNavigationBarLoading();
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

  //上滑加载更多
  onReachBottom: function(event) {
    var catId = wx.getStorageSync('catId');
    var totalCount = this.data.totalCount;
    var nextUrl = api.api_list.get_article_list_api + catId +
      "&start=" + totalCount + "&count=" + this.data.count;
    api.http(nextUrl, this.processArtList)
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
  
  //分享
  onShareAppMessage: function(ops) {
    var path = "/pages/category/articleList/articleList";
    var openId = wx.getStorageSync('openId');
    return {
      title: "安法苑，法律法规任您看!",
      path: path + '?userOpenId=' + openId,
      imageUrl: '/image/share.png',
    }
    that.setData({
      notvip: data
    })
  }
})