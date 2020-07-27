var api = require('../data/data.js');
Page({

  data: {
    inputValue: '', //搜索关键词
    isforcus: false, //是否聚焦到搜索框
    showCancelImg: false, //默认是否显示图标
    curSecondCate: 0, //当前页面的父 二级分类
    curThirdCate: 0, //当前高亮的三级分类
    thirdCateList: {}, //当前所有三级分类的列表
    curRequirementsList: {}, //当前分类的数据
    h_collection:{},//隐患排查的收藏列表
    searchCnt: 0, //搜索总数
    totalCount: 0,
    count: 20,
  },

  //点击菜单：获取安全要求数据
  goToRequirements: function(e) {
    this.clearResultData();
    var catId = wx.getStorageSync("curThirdCate");
    if (e != null) {
      catId = e.currentTarget.dataset.catid;
      this.setData({
        curThirdCate: catId,
        totalCount: 0
      })
    }
    //调服务器接口，得到对应的数据
    var url = api.api_list.search_requirements + "&catIdList=" + catId + "&start=" + this.data.totalCount + "&count=" + this.data.count;
    console.log(url);
    api.http(url, this.processSearch);
  },

  //清空结果
  clearResultData: function() {
    this.setData({
      curRequirementsList: {},
      totalCount: 0,
      inputValue:'',
      isforcus: false, 
    })
  },

  //页面初始化时：获得三级分类列表
  getThirdCateList: function(upperCatId) {
    var that = this;
    var url = api.api_list.get_requierments_last_category + upperCatId;
    api.http(url, function(res) {
      var allThirdCat = res[0].sub_cate_id;
      wx.setStorageSync("curThirdCate", allThirdCat);
      that.setData({
        thirdCateList: res,
        curThirdCate: allThirdCat
      })
    })
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
    this.goToRequirements();
    api.hideLoading();
  },

  //搜索：当前二级分类下的所有安全要求
  searchReqirements: function(event) {
    this.clearResultData();
    var catList = this.data.curThirdCate;
    var keywords = event.detail.value;
    this.setData({
      inputValue:keywords
    })
    var url = api.api_list.search_requirements + keywords + "&catIdList=" + catList + "&start=" + this.data.totalCount + "&count=" + this.data.count;
    console.log(url);
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
    console.log(nextUrl);
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

  onHAgree:function(e){
    var self = this;
    api.onHAgree(e);
    var h_agree = wx.getStorageSync("h_agree");
    var listItems = wx.getStorageSync("h_listItems");
    self.setData({
      h_agree: h_agree,
      curRequirementsList: listItems
    })
  },

  onHCollect:function(e){
    var self = this;
    api.onHCollect(e);
    var collection_list = wx.getStorageSync("h_collection");
    var listItems = wx.getStorageSync("h_listItems");
    self.setData({
      h_collection: collection_list,
      curRequirementsList: listItems
    })
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
  }
})