var api = require('../data/data.js');
const app = getApp();
Page({
  data: {
    cateItems: null,
    curNav: 1,
    curIndex: 0,
    searchData: {},
    navRightHeight: 0,
  },

  onLoad: function() {
    api.showLoading("正在加载...");
    var self = this;
    wx.request({
      url: api.api_list.get_category_api,
      method: 'GET',
      success: function(res) {
        self.setData({
          cateItems: res.data
        })
        api.hideLoading();
      }
    });

    //获得窗口的高度，设置右侧滚动窗口的高度
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight;
        var clientWidth = res.windowWidth;
        var rpxR = 750 / clientWidth;
        var navRightHeight = clientHeight * 0.5 * rpxR;
        self.setData({
          navRightHeight: navRightHeight
        });
      }
    });


  },
  //事件处理函数  
  switchRightTab: function(e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  // 获取到焦点
  focus: function(e) {
    wx.navigateTo({
      url: '/pages/home/search/search',
    })
  },

  gotoAbstract: function(e) {
    var catId = e.currentTarget.dataset.catid;
    var catName = e.currentTarget.dataset.cname;
    var catDesc = e.currentTarget.dataset.cdesc;
    wx.setStorageSync('catId', catId);
    wx.setStorageSync('catName', catName);
    wx.setStorageSync('catDesc', catDesc);
    wx.navigateTo({
      url: '/pages/category/articleList/articleList',
    })
  },

  //分享
  onShareAppMessage: function(ops) {
    var path = "/pages/category/category";
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