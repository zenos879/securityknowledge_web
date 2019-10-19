var api_list = require('../data/data.js');

Page({
  data: {
    inputValue: '', //搜索的内容
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    listItems: '',
    catId: '',
    catName: '',
    curIndex: 0,
    art_cnt: '',
    showSearch: false,
    showHomePage: true,
    searchData: {},
    listItems: {},
    collection_list: {}
  },

  /**
   * 搜索执行按钮
   */
  query: function(event) {
    var inputKeyWord = event.detail.value;
    var that = this;
    wx.request({
      url: api_list.api_list.search_article_api + inputKeyWord,
      method: 'GET',
      success: function(res) {
        var searchData = res.data
        that.setData({
          searchData: searchData
        })

        wx.setStorage({
          key: 'searchLists',
          data: {
            searchLists: searchData
          }
        })


        if (!inputKeyWord) {
          //没有搜索词 友情提示
          wx.showToast({
            title: '请重新输入',
            image: '/pages/image/tear.png',
            duration: 2000,
          })
        } else if (searchData.length == 0) {
          //搜索词不存在 友情提示
          wx.showToast({
            title: '关键词不存在',
            image: '/pages/image/tear.png',
            duration: 2000,
          })
        } else {
          var collection_list = wx.getStorageSync("collection_list");
          that.setData({
            showSearch: true,
            showHomePage: false,
            listItems: searchData,
            collection_list: collection_list
          })
        }
      }
    })
  },

  onBindFocus: function(event) {
    this.setData({
      showHomePage: false,
      showSearch: true
    })


  },
  onLoad: function(options) {
    var catId = wx.getStorageSync('catId');
    var catName = wx.getStorageSync('catName');
    var catDesc = wx.getStorageSync('catDesc');
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
          art_cnt: res.data.length
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

  onCancelImgTap: function(event) {
    this.setData({
      showHomePage: true,
      showSearch: false,
      searchData: {},
      listItems: {},
      collection_list: {}
    })
  },

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

    //收藏变取消，非收藏变收藏
    collect = !collect;
    collection_list[artid] = collect;
    wx.setStorageSync("collection_list", collection_list);
    self.setData({
      collection_list: collection_list,
      listItems: listItems
    })
    //显示提示框
    wx.showToast({
      title: collect ? '收藏成功' : '取消成功',
      duration: 1000,
      icon: 'success'
    })

  },

})