var api = require('../../data/data.js')
Page({
  data: {
    inputValue: '',
    isforcus: true,
    collection_list: [],
    listItems: [],
    searchData: [],
    showCancelImg: false,
    searchCnt: 0,
    totalCount: 0,
    count: 20,
    notLogin: false,
    notvip: false
  },

  onLoad: function(options) {},
  /**
   * 搜索执行按钮
   */
  query: function(event) {
    api.showLoading("正在加载...");
    this.onCancelImgTap();
    var inputKeyWord = event.detail.value;
    if (inputKeyWord.trim() == '') {
      api.showToast("请输入关键词", "/image/tear.png");
      return;
    } else {
      this.setData({
        inputValue: inputKeyWord
      })
      var url = api.api_list.search_article_api + inputKeyWord +
        "&start=" + this.data.totalCount + "&count=" + this.data.count;
      // console.log(url);
      api.http(url, this.processSearch);
    }
  },

  //处理搜索结果
  processSearch: function(res) {
    api.hideLoading();
    var that = this;
    var listItems;
    if (that.data.listItems && that.data.listItems.length > 0) {
      listItems = that.data.listItems.concat(res.data);
    } else {
      listItems = res.data;
    }
    var searchCnt = res.searchCnt;
    wx.setStorageSync("searchData", listItems);
    if (listItems == null || listItems.length == 0) {
      api.showToast("没有该关键词", "/image/tear.png");
    } else {
      var totalCount = that.data.totalCount + that.data.count;
      wx.setStorageSync("listItems", listItems);
      api.convertCollectListToListItmes();
      var collection_list = wx.getStorageSync("collection_list");
      listItems = wx.getStorageSync("listItems");
      that.setData({
        listItems: listItems,
        collection_list: collection_list,
        searchCnt: searchCnt,
        totalCount: totalCount
      })
    }
    wx.hideNavigationBarLoading();
  },

  //上滑加载更多
  onReachBottom: function(event) {
    var inputValue = this.data.inputValue;
    var totalCount = this.data.totalCount;
    var count = this.data.count;
    var nextUrl = api.api_list.search_article_api + inputValue +
      "&start=" + totalCount + "&count=" + count;
    console.log(nextUrl);
    api.http(nextUrl, this.processSearch);
    wx.showNavigationBarLoading();
  },

  //有输入了，显示*图标
  bindinput: function() {
    this.setData({
      showCancelImg: true
    })
  },

  //点击*图标的动作
  onCancelImgTap: function(event) {
    this.setData({
      inputValue: '',
      isforcus: true,
      listItems: {},
      collection_list: {},
      showCancelImg: false,
      totalCount: 0,
      searchCnt: 0
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
  onShareAppMessage: function(ops) {
    var path = "/pages/home/search/search";
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