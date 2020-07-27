var api = require('../data/data.js')
var app = getApp();
Page({
  data: {
    inputValue: '', //搜索的内容
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    catId: '',
    catName: '',
    curIndex: 0,
    art_cnt: '',
    showSearch: false,
    showHomePage: true,
    searchData: {},
    listItems: {},
    collection_list: {},
    total_articles: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hideInput: false,
    hotItems: [],
    notLogin: false,
    notvip: false
  },

  // showTopToast: function(str) {
  //   var _this = this;
  //   _this.setData({
  //     isShow: true,
  //     txt: str
  //   });
  //   setTimeout(function() { //toast消失
  //     _this.setData({
  //       isShow: false
  //     });
  //   }, 5000);
  // },

  //加载首页数据
  loadHomePageData: function() {
    //获取'热门标签'
    var url = api.api_list.get_hot_tag;
    api.http(url, this.loadHottag);

    //获取 '最新发布' 的数据
    url = api.api_list.get_update_list + "?start=0&count=5";
    api.http(url, this.loadUpdate);

    //获取'总文章数量'
    var total_articles = 0;
    if (total_articles == null || total_articles == 0) {
      url = api.api_list.get_total_articles;
      api.http(url, this.loadTotalArtNo);
    } else {
      this.setData({
        total_articles: total_articles
      })
    };

    //获取 '首页的轮播图'
    url = api.api_list.get_home_img;
    api.http(url, this.loadSwiperImg);

    //取消加载框
    api.hideLoading();
  },

  //加载轮播图
  loadSwiperImg: function(res) {
    var now = new Date().getTime();
    var tmp = [res.img1 + "?ts=" + now, res.img2 + "?ts=" + now, res.img3 + "?ts=" + now];
    this.setData({
      imgUrls: tmp
    })
  },

  //加载文章总数
  loadTotalArtNo: function(res) {
    var self = this;
    self.setData({
      total_articles: res
    })
  },

  //加载最近更新
  loadUpdate: function(res) {
    var self = this;
    self.setData({
      listItems: res
    })
  },
  //加载热门标签
  loadHottag: function(res) {
    var self = this;
    wx.setStorageSync("hottag", res);
    self.setData({
      hotItems: res
    })
  },

  // 获取到焦点
  focus: function(e) {
    wx.navigateTo({
      url: '/pages/home/search/search',
    })
  },

  //初始化
  init: function() {
    // this.getSetting();
    this.loadHomePageData();
  },

  onLoad: function(options) {
    this.init();
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
    } else {//然后看是否vip
      api.ifVip(function (notvip) {
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

  openNewPage: function(a) {
    api.openNewPage(a);
  },

  //跳转到具体的分类列表页面中
  goToCategory: function(e) {
    var catId = e.currentTarget.dataset.catid;
    var catName = e.currentTarget.dataset.cname;
    var catDesc = catName;
    wx.setStorageSync('catId', catId);
    wx.setStorageSync('catName', catName);
    wx.setStorageSync('catDesc', catDesc);
    wx.navigateTo({
      url: '/pages/category/articleList/articleList',
    })
  },

  //打开文章
  openArticle: function(e) {
    api.openArticle(e)
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
    }
    that.setData({
      notvip: data
    })
  },


  //分享到朋友圈
  onShareTimeline:function(res) {
    return {
      title: '安全生产法律法规，随你看！',
      query: '我是带的参数'
    }
  }


})