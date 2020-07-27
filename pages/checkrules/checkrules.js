var api = require('../data/data.js');
const app = getApp();
Page({

  data: {
    inputValue: '', //搜索关键词
    isforcus: false, //是否聚焦到搜索框
    showCancelImg: false, //默认是否显示图标
    curSecondCate: 0, //当前页面的父 二级分类
    curThirdCate: 0, //当前高亮的三级分类
    thirdCateList: {}, //当前所有三级分类的列表
    curRequirementsList: {}, //当前分类的数据
    h_collection: {}, //隐患排查的收藏列表
    h_agree: {}, //隐患排查的点赞数据
    searchCnt: 0, //搜索总数
    totalCount: 0,
    count: 20,
    notLogin: false, //是否登录
    notvip: false, //是否有vip权限
    noContent:false, //没有数据时的默认显示
    noContentToast:'该类数据正在整理中，敬请期待!'
  },



  onLoad: function(options) {
    api.showLoading("正在加载...");
    var catId = wx.getStorageSync('yCatId');
    var catName = wx.getStorageSync('yCatName');
    wx.setNavigationBarTitle({
      title: catName
    })
    //首先获得三级目录，初始化上面的滚动条
    this.getThirdCateList(catId);
    //点击“全部”的按钮
    // this.goToRequirements();
    api.hideLoading();
  },

  //页面初始化时：获得三级分类列表
  getThirdCateList: function(upperCatId) {
    var that = this;
    var url = api.api_list.get_requierments_last_category + upperCatId;
    api.http(url, function(res) {
      if (res != null && res.length > 0) {
        var allThirdCat = res[0].sub_cate_id;
        that.goToRequirements(allThirdCat);
        wx.setStorageSync("curThirdCate", allThirdCat);
        that.setData({
          thirdCateList: res,
          curThirdCate: allThirdCat,
          curRequirementsList: {}
        })
      }else{
        that.setData({
          noContent:true
        })
      }
    })
  },

  //点击菜单：获取安全要求数据
  goToRequirements: function(catId) {
    var that = this;
    that.clearResultData();

    //调服务器接口，得到对应的数据
    var url = api.api_list.search_requirements + "&catIdList=" + catId + "&start=" + that.data.totalCount + "&count=" + that.data.count;
    api.http(url, that.processSearch);
  },


  clickThirdCate: function(e) {
    var catId = 0;
    if (e != null) {
      catId = e.currentTarget.dataset.catid;
      this.setData({
        curThirdCate: catId,
        totalCount: 0,
      })
      this.goToRequirements(catId);
    }
  },

  //清空结果
  clearResultData: function() {
    this.setData({
      curRequirementsList: {},
      totalCount: 0,
      inputValue: '',
      isforcus: false,
      noContent: false
    })
  },

  //搜索：当前二级分类下的所有安全要求
  searchReqirements: function(event) {
    this.clearResultData();
    var catList = this.data.curThirdCate;
    var keywords = event.detail.value;
    this.setData({
      inputValue: keywords
    })
    var url = api.api_list.search_requirements + keywords + "&catIdList=" + catList + "&start=" + this.data.totalCount + "&count=" + this.data.count;
    api.http(url, this.processSearch);
  },

  //上滑加载更多
  onReachBottom: function(event) {
    var inputValue = this.data.inputValue; //用户输入的关键词，可能有，可能无
    var catList = this.data.curThirdCate; //当前高亮的三级分类
    var searchCnt = this.data.searchCnt;
    var totalCount = this.data.totalCount;
    var count = this.data.count;

    var nextUrl = api.api_list.search_requirements + inputValue + "&catIdList=" + catList +
      "&start=" + this.data.totalCount + "&count=" + count;
    api.http(nextUrl, this.processSearch);
  },

  processSearch: function(res) {
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
      api.showToast("暂无数据", "/image/tear.png");
    } else {

      //进行收藏和点赞数据的编入
      wx.setStorageSync("h_listItems", curRequirementsList);
      api.convertHCollectAndAgreeToListItmes();
      curRequirementsList = wx.getStorageSync("h_listItems");

      //数据展现
      var totalCount = that.data.totalCount + that.data.count;
      that.setData({
        curRequirementsList: curRequirementsList,
        searchCnt: searchCnt,
        totalCount: totalCount
      })
    }
    wx.hideNavigationBarLoading();
  },

  //点赞按钮的动作
  onHAgree: function(e) {
    var self = this;
    //首先，看用户是否登录.如果没有没登录，拉起面板，让登录。
    var openId = wx.getStorageSync("openId");
    if (openId == null || openId.length == 0) {
      self.setData({
        notLogin: true
      })
    } else { //然后看是否vip (以防已经登录，但VIP已经过期的情况)
      api.hiddenIfVip(function(notvip) {
        self.setData({
          notvip: notvip
        })
        api.onHAgree(e);
        var h_agree = wx.getStorageSync("h_agree");
        var listItems = wx.getStorageSync("h_listItems");
        self.setData({
          h_agree: h_agree,
          curRequirementsList: listItems
        })
      });
    }
  },


  //收藏按钮的动作
  onHCollect: function(e) {
    var self = this;
    //首先，看用户是否登录.如果没有没登录，拉起面板，让登录。
    var openId = wx.getStorageSync("openId");
    if (openId == null || openId.length == 0) {
      self.setData({
        notLogin: true
      })
    } else { //然后看是否vip (以防已经登录，但VIP已经过期的情况)
      api.hiddenIfVip(function(notvip) {
        self.setData({
          notvip: notvip
        })
        api.onHCollect(e);
        var collection_list = wx.getStorageSync("h_collection");
        var listItems = wx.getStorageSync("h_listItems");
        self.setData({
          h_collection: collection_list,
          curRequirementsList: listItems
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
      api.hiddenIfVip(function(notvip) {
        that.setData({
          notvip: notvip
        })
      });
      that.onLoad();
    });
  },

  //有输入了，显示*图标
  showCancelImg: function() {
    this.setData({
      showCancelImg: true
    })
  },

  //点击*图标的动作
  onCancelImgTap: function(event) {
    this.setData({
      inputValue: '',
      isforcus: true,
      showCancelImg: false,
      curRequirementsList: {},
      totalCount: 0,
      searchCnt: 0
    })
  },

  //分享按钮
  onShareAppMessage: function() {
    var path = "/pages/checkrules/checkrules";
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
  onShareTimeline: function(res) {
    return {
      title: '安全生产隐患排查，随你看！',
      query: '我是带的参数'
    }
  }
})