var api_list = require('../../data/data.js');
Page({
  data: {
    listItems: {},
    collection_list: {}
  },


  onLoad: function(options) {
    var collection_list = wx.getStorageSync("collection_list");
    var artIds = "";
    for (var i = 0; i < collection_list.length; i++) {
      if (collection_list[i]) {
        artIds += i + ",";
      }
    }
    if (artIds != '') {
      artIds = artIds.substring(0, artIds.length - 1);
    }
    var self = this;
    wx.request({
      url: api_list.api_list.get_article_title_api + artIds,
      method: 'GET',
      success: function(res) {
        self.setData({
          listItems: res.data,
          collection_list: collection_list
        })
      }
    })
  },

  onCollect: function(e) {
    var self = this;
    var collection_list = wx.getStorageSync("collection_list");
    var artid = e.currentTarget.dataset.artid;
    var listItems = self.data.listItems;
    var collect = '';
    if (collection_list) {
      collect = collection_list[artid];
    } else {
      collection_list = [];
      wx.setStorageSync("collection_list", collection_list);
    }

    var listItemsNew = [];
    for (var i = 0; i < listItems.length; i++) {
      if (listItems[i].art_id != artid) {
        listItemsNew[i] = listItems[i];
      }
    }

    //收藏变取消，非收藏变收藏
    collect = !collect;
    collection_list[artid] = collect;
    wx.setStorageSync("collection_list", collection_list);
    self.setData({
      collection_list: collection_list,
      listItems: listItemsNew
    })
    //显示提示框
    wx.showToast({
      title: collect ? '收藏成功' : '取消成功',
      duration: 1000,
      icon: 'success'
    })
    this.onLoad();
  },
})