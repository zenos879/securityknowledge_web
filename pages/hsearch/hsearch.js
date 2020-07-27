var api = require('../data/data.js')
const app = getApp();
Page({
  data: {
    inputValue: '',
    isforcus: true,
    collection_list: [],
    curRequirementsList: [],
    searchData: [],
    showCancelImg: false,
    searchCnt: 0, //搜索总数结果
    totalCount: 0,//当前总数
    count: 20,  //每次查询数量
    notLogin: false,
    notvip: false,
    barTitle:"全局搜索安全要求"
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.barTitle
    })
   },
  /**
   * 搜索执行按钮
   */
  query: function (event) {
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
      var url = api.api_list.search_requirements + inputKeyWord +
        "&start=" + this.data.totalCount + "&count=" + this.data.count;
      api.http(url, this.processSearch);
    }
    wx.setNavigationBarTitle({
      title: "与 「"+inputKeyWord+"」相关的安全要求"
    })
  },

  //处理搜索结果
  processSearch: function (res) {
    api.hideLoading();
    var that = this;
    var curRequirementsList;
    //如果之前有数据，此处追加进新据
    if (that.data.curRequirementsList && that.data.curRequirementsList.length > 0) {
      curRequirementsList = that.data.curRequirementsList.concat(res.data);
    } else {
      curRequirementsList = res.data;
    }
    var searchCnt = res.searchCnt;
    if (curRequirementsList == null || curRequirementsList.length == 0) {
      api.showToast("没有该关键词", "/image/tear.png");
    } else {
      var totalCount = that.data.totalCount + that.data.count;
      that.setData({
        curRequirementsList: curRequirementsList,
        searchCnt: searchCnt,
        totalCount: totalCount
      })
    }
    wx.hideNavigationBarLoading();
  },

  //上滑加载更多
  onReachBottom: function (event) {
    var inputValue = this.data.inputValue;
    var searchCnt = this.data.searchCnt;
    var totalCount = this.data.totalCount;
    var count = this.data.count;
 
    var nextUrl = api.api_list.search_requirements + inputValue +
      "&start=" + this.data.totalCount + "&count=" + count;
 
    api.http(nextUrl, this.processSearch);
    wx.showNavigationBarLoading();
  },

  //有输入了，显示*图标
  bindinput: function () {
    this.setData({
      showCancelImg: true
    })
  },

  //点击*图标的动作
  onCancelImgTap: function (event) {
    this.setData({
      inputValue: '',
      isforcus: true,
      curRequirementsList: {},
      showCancelImg: false,
      totalCount: 0,
      searchCnt: 0
    })
  },

  //点击收藏
  onCollect: function (e) {
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
  openArticle: function (e) {
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