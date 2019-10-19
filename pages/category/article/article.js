var api_list = require('../../data/data.js');
Page({
  data: {
    art_id: 1,
    art_title: '',
    art_content: '',
    file_url: ''
  },

  onLoad: function(options) {
    var art_id = wx.getStorageSync("artid");
    var file_url = '';
    var self = this;
    wx.request({
      url: api_list.api_list.get_article_api + art_id,
      method: 'GET',
      success: function(res) {
        self.setData({
          art_title: res.data.title,
          art_id: art_id,
          // art_content: res.data.file_cnt,
          file_url: res.data.file_path,
        })

        file_url = res.data.file_path;
        file_url = file_url.replace(api_list.api_list.get_local_file_path, api_list.api_list.get_file_url);
        wx.downloadFile({
          url: file_url,
          success: function(res) {
            var Path = res.tempFilePath;
            wx.openDocument({
              filePath: Path,
              success: function(res) {
                var historyList = wx.getStorageSync("history_list");
                if (historyList == null || historyList.length == 0) {
                  historyList = [art_id];
                } else {
                  historyList.push(art_id);
                }
                wx.setStorageSync("history_list", historyList)
              }
            })
          },
          fail: function(res) {
            console.log(res);
          }
        })
      }
    })
  },
})