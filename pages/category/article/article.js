var api = require('../../data/data.js');
const app = getApp();
Page({
  data: {
    art_id: 1,
    art_title: '',
    art_content: '',
    file_url: '',
    file_name: '静电安全术语.pdf'
  },

  onLoad: function(options) {
    // api.showLoading("正在加载...");
    var art_id = wx.getStorageSync("artid");
    var art_path = wx.getStorageSync("artpath");
    if (art_path != null) {
      var file_name = art_path.substring(art_path.lastIndexOf("\\") + 1, art_path.length);
      this.setData({
         file_name: file_name
      })
    } else {
      wx.showToast({
        title: '实在抱歉，该文件还没有上线 o(╥﹏╥)o ...',
      })
    }
  },

  // onLoad: function(options) {
  //   api.showLoading("正在加载...");
  //   var art_id = wx.getStorageSync("artid");
  //   var file_url = '';
  //   var self = this;
  //   wx.request({
  //     url: api.api_list.get_article_api + art_id,
  //     method: 'GET',
  //     success: function(res) {
  //       file_url = res.data.file_path;
  //       self.setData({
  //         art_title: res.data.title,
  //         art_id: art_id,
  //         // art_content: res.data.file_cnt,
  //         file_url: file_url,
  //       })

  //       if (file_url != '' && file_url.length > 0) {
  //         file_url = file_url.replace(api.api_list.get_local_file_path, api.api_list.get_file_url);
  //         wx.downloadFile({
  //           url: file_url,
  //           success: function(res) {
  //             var Path = res.tempFilePath;
  //             wx.openDocument({
  //               filePath: Path,
  //               success: function(res) {
  //                 self.updateAriticleViewtimes(art_id);
  //                 self.updateUserViewHistory(art_id);
  //                 api.hideLoading();
  //               }
  //             })
  //           },
  //           fail: function(res) {
  //             console.log(res);
  //           }
  //         })
  //       } else {
  //         self.setData({
  //           art_content: "实在抱歉，该文件还没有上线 o(╥﹏╥)o ... "
  //         })
  //       }
  //     }
  //   })
  // },

  //更新文章的浏览次数
  updateAriticleViewtimes: function(art_id) {
    var url = api.api_list.updateAriticleViewtimes + "?artId=" + art_id;
    api.http(url, function() {});
  },

  //更新用户观看历史
  updateUserViewHistory: function(art_id) {
    var self = this;
    var historyList = wx.getStorageSync("history_list");
    art_id = parseInt(art_id);
    if (historyList == null || historyList.length == 0 || historyList == '') {
      historyList = [art_id];
      wx.setStorageSync("history_list", historyList)
      self.updateUserView(historyList);
    } else {
      if (historyList.indexOf(art_id) < 0) {
        historyList.push(art_id);
        wx.setStorageSync("history_list", historyList)
        self.updateUserView(historyList);
      }
    }
  },
  //发请求，对用户的观看历史做更新
  updateUserView: function(historyList) {
    var self = this;
    var openId = wx.getStorageSync("openId");
    var url = api.api_list.updateUserViewHistory + "?openId=" + openId + "&historyList=" + historyList;
    api.http(url, function() {});
  },


  //分享
  onShareAppMessage: function(ops) {
    var path = "/pages/category/article/article";
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