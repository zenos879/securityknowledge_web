Page({
 
  data: {
  },

 
  onLoad: function (options) {
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'pages/apps/largess/detail?id=nN72oYbnMLqgPc1CLmE7uw%3D%3D',
   //   envVersion: 'develop',
      success(res) {
        // 打开成功
        console.log(res);
      }
    })
  },

  
})
