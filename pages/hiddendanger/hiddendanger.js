var api = require('../data/data.js');
const app = getApp();
Page({
  data: {
    cateItems: null,
    curNav: 5,
    curIndex: 0,
    searchData: {},
    navRightHeight: 0,
  },

  onLoad: function() {
    api.showLoading("正在加载...");
    var self = this;
    wx.request({
      url: api.api_list.get_requirements_category,
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
        var navRightHeight = clientHeight * rpxR * 0.35;
        console.log(clientHeight);
        console.log(clientWidth);
        console.log(navRightHeight);
        self.setData({
          navRightHeight: navRightHeight
        });
 
        // var navTest = (clientHeight * 750 / clientWidth )*0.5 - 30;
        // console.log(navTest);
        // self.setData({
        //   navRightHeight: navTest
        // })

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

  // 获取到焦点---需要单独有一个搜索页面，区别于文章的检索
  focus: function(e) {
    wx.navigateTo({
      url: '/pages/hsearch/hsearch',
    })
  },

  gotoAbstract: function(e) {
    var yCatId = e.currentTarget.dataset.catid;
    var yCatName = e.currentTarget.dataset.cname;
    var yCatDesc = e.currentTarget.dataset.cdesc;
    wx.setStorageSync('yCatId', yCatId);
    wx.setStorageSync('yCatName', yCatName);
    wx.setStorageSync('yCatDesc', yCatDesc);
    wx.navigateTo({
      url: '/pages/checkrules/checkrules',
    })
  },

  //分享
  onShareAppMessage: function(ops) {
    var path = "/pages/hiddendanger/hiddendanger";
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
      title: '安全生产隐患排查，随你看！',
      query: '我是带的参数'
    }
  }
})