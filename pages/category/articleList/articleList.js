var api_list = require('../../data/data.js');
Page({
  data: {
    listItems: '',
    catId: '',
    catName: '',
    catDesc: '',
    curIndex: 0,
    art_cnt: '',
    collection_list: ''
  },

  onLoad: function(options) {
    var catId = wx.getStorageSync('catId');
    var catName = wx.getStorageSync('catName');
    var catDesc = wx.getStorageSync('catDesc');
    var collection_list = wx.getStorageSync("collection_list");

    var self = this;
    wx.request({
      url: api_list.api_list.get_article_list_api + catId,
      method: 'GET',
      success: function(res) {
        self.setData({
          listItems: res.data,
          catId: catId,
          catName: catName,
          catDesc: catDesc,
          art_cnt: res.data.length,
          collection_list: collection_list
        })
      }
    })
  },
  
  gotoArticle: function(e) {
    var artid = e.currentTarget.dataset.artid;
    wx.setStorageSync('artid', artid);
    wx.navigateTo({
      url: '/pages/category/article/article',
    })
  },

  onCollect: function(e) {
    var self = this;
    var collection_list = wx.getStorageSync("collection_list");
    var artid = e.currentTarget.dataset.artid;
    var collect = '';
    if (collection_list) {
      collect = collection_list[artid];
    } else {
      collection_list = [];
      wx.setStorageSync("collection_list", collection_list);
    }

    //收藏变取消，非收藏变收藏
    collect = !collect;
    collection_list[artid] = collect;
    wx.setStorageSync("collection_list", collection_list);
    self.setData({
      collection_list: collection_list
    })
    //显示提示框
    wx.showToast({
      title: collect ? '收藏成功' : '取消成功',
      duration: 1000,
      icon: 'success'
    })

  },


})