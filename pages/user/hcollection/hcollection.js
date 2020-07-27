var api = require('../../data/data.js');
const app = getApp();
Page({
  data: {
    curRequirementsList: {},
    h_collection: {},
    noContent:false,
    noContentToast:''
  },

  onLoad: function (options) {
    api.showLoading("正在加载...");
    var h_collection = wx.getStorageSync("h_collection");
    if (h_collection && h_collection.length > 0) {
      var reqIds = h_collection.join(",");
      var url = api.api_list.search_requirements_by_id + reqIds;
      api.http(url, this.processCollect);
    } else {
      this.setData({
        noContent: true,
        noContentToast: "您还没有收藏的「安全要求」哦，快去点击小星星，添加收藏吧 ^_^..."
      })
    }
    api.hideLoading();
  },

  //处理收藏结果
  processCollect: function (res) {
    var self = this;
    var listItems = res.data;
    wx.setStorageSync("h_listItems", listItems);
    api.convertHCollectAndAgreeToListItmes();
    var h_collection = wx.getStorageSync("h_collection");
    listItems = wx.getStorageSync("h_listItems");
    self.setData({
      curRequirementsList: listItems,
      h_collection: h_collection
    })
  },

  onHAgree: function (e) {
    var self = this;
    api.onHAgree(e);
    var h_agree = wx.getStorageSync("h_agree");
    var listItems = wx.getStorageSync("h_listItems");
    self.setData({
      h_agree: h_agree,
      curRequirementsList: listItems
    })
    self.onLoad();
  },

  onHCollect: function (e) {
    var self = this;
    api.onHCollect(e);
    var collection_list = wx.getStorageSync("h_collection");
    var listItems = wx.getStorageSync("h_listItems");
    self.setData({
      h_collection: collection_list,
      curRequirementsList: listItems
    })
    self.onLoad();
  },
  

  //分享
  onShareAppMessage: function (ops) {
    var path = "/pages/home/collect/collect";
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