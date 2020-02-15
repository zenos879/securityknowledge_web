var api = require('../../data/data.js');
Page({
  data: {
    listItems: {},
    collection_list: {},
    noContent: false,
    noContentToast: '',
    notvip: false
  },

  onLoad: function(options) {
    api.showLoading("正在加载...");
    var collection_list = wx.getStorageSync("collection_list");
    if (collection_list && collection_list.length > 0) {
      var artIds = collection_list.join(",");
      var url = api.api_list.get_article_title_api + artIds;
      api.http(url, this.processCollect);
    } else {
      this.setData({
        noContent: true,
        noContentToast: "您还没有收藏的规范哦，快去点击小星星，添加收藏吧 ^_^..."
      })
    }
    api.hideLoading();
  },

  //处理收藏结果
  processCollect: function(res) {
    var self = this;
    var listItems = res;
    wx.setStorageSync("listItems", listItems);
    api.convertCollectListToListItmes();
    var collection_list = wx.getStorageSync("collection_list");
    listItems = wx.getStorageSync("listItems");
    self.setData({
      listItems: listItems,
      collection_list: collection_list
    })
  },

  //点击收藏
  onCollect: function(e) {
    var self = this;
    api.onCollect(e);
    var collection_list = wx.getStorageSync("collection_list");
    var listItems = wx.getStorageSync("listItems");
    self.setData({
      collection_list: collection_list,
      listItems: listItems
    })
    self.onLoad();
  },

  //打开文章
  openArticle: function(e) {
    api.openArticle(e);
  },


  //打开页面
  openPage: function (a) {
    var that = this;
    api.openPage(a, function (notvip) {
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
        }, 3000);
        api.openPage(a, function () { });
      }
    });
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