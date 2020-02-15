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
    isLogin: true,
    notvip: false
  },

  //获得用户信息
  getSetting: function() {
    var that = this;
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            isLogin: false
          });
          api.showLoading("正在加载...");
          that.getUserInfo(res);
        } else {
          that.setData({
            isLogin: true
          });
        }
      }
    });
  },

  //获得用户信息
  getUserInfo: function(e) {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        var userInfo = res.userInfo;
        wx.setStorageSync("userInfo", userInfo);
        var openId = wx.getStorageSync("openId");
        if (openId == null || openId.length == 0) {
          that.showTopToast("点击 ··· 添加到我的小程序"); //显示右上角的添加收藏提示框
          that.getUserOpenId(that.onOpenIdComplete, openId, userInfo);
        } else {
          that.onOpenIdComplete(openId, userInfo);
        }
      }
    });
  },

  //获得用户openId
  getUserOpenId: function(callback, openId, userInfo) {
    var that = this;
    wx.login({
      success: res => {
        var url = api.api_list.get_open_id + "?code=" + res.code;
        wx.request({
          url: url,
          success: res => {
            callback && callback(res.data.openid, userInfo);
          }
        });
      }
    });
  },

  //openid 获取之后，注册加载首页
  onOpenIdComplete: function(openId, userInfo) {
    wx.setStorageSync("openId", openId);
    wx.setStorageSync("userInfo", userInfo);
    this.loadHomePageData();
  },

  //注册，更新用户数据
  register: function() {
    var openId = wx.getStorageSync("openId");
    var userInfo = wx.getStorageSync("userInfo");
    // utils.register(openId, userInfo); //与服务端通信，更新用户数据
    var tmp = JSON.stringify(userInfo)
    wx.request({
      url: api.api_list.register + "?openId=" + openId + "&nickName=" + userInfo.nickName + "&avatarUrl=" + userInfo.avatarUrl,
      method: 'GET',
      success: function(res) {
        //将收藏和历史的数据，写入缓存，后面直接用即可。
        //后面再setStorageSync的时候，要同时更新服务端数据。
        if (res.data != null) {
          // var collectionList = res.data.collections.split(",");
          // var historyList = res.data.histories;
          var collectionList = res.data[0].collections;
          var historyList = res.data[0].histories;
          wx.setStorageSync("collection_list", collectionList);
          wx.setStorageSync("history_list", historyList);
        }
      }
    })
  },


  //获取用户数据
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      var that = this;
      that.getSetting();
      that.setData({
        isLogin: false
      });
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          // 用户没有授权成功，不需要改变 isLogin 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  showTopToast: function(str) {
    var _this = this;
    _this.setData({
      isShow: true,
      txt: str
    });
    setTimeout(function() { //toast消失
      _this.setData({
        isShow: false
      });
    }, 5000);
  },

  //加载首页数据
  loadHomePageData: function() {
    var self = this;

    //获取热门标签
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
      self.setData({
        total_articles: total_articles
      })
    };

    //获取 '首页的轮播图'
    url = api.api_list.get_home_img;

    api.http(url, this.loadSwiperImg);

    //取消加载框
    api.hideLoading();
    self.register();
  },

  loadSwiperImg: function(res) {
    var self = this;
   
    var now=new Date().getTime(); 
    var tmp = [res.img1 + "?ts=" + now, res.img2 + "?ts=" + now, res.img3 + "?ts=" + now];
    self.setData({
      imgUrls: tmp
    })
  },

  loadTotalArtNo: function(res) {
    var self = this;
    self.setData({
      total_articles: res
    })
  },

  loadUpdate: function(res) {
    var self = this;
    self.setData({
      listItems: res
    })
  },
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
  },

  onLoad: function(options) {
    this.init();
  },

  //打开页面
  openPage: function(a) {
    var that = this;
    api.openPage(a, function(notvip) {
      if (notvip) {//无vip权限
        that.setData({
          notvip: notvip
        })
        setTimeout(function () { 
          var openId = wx.getStorageSync("openId");
          api.updateVIPperiod(openId);//然后更新vip权限
          that.setData({ //最后收起分享对话框
            notvip: false
          });
        }, 10000);
        api.openPage(a, function(){});
      }
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
  }


})