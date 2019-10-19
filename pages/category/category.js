var api_list = require('../data/data.js');
Page({
  data: {
    cateItems: null,
    curNav: 1,
    curIndex: 0
  },

  onLoad: function() {
    var self = this;
    wx.request({
      url: api_list.api_list.get_category_api,
      method: 'GET',
      success: function(res) {
        console.log(res);
        self.setData({
          cateItems: res.data
        })
      }
    })
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
  }
})