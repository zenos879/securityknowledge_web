var api_list = {
  get_category_api: 'https://www.safetylaw.cn/safetyknowledge/search/getCategory',
  get_article_list_api: 'https://www.safetylaw.cn/safetyknowledge/search/getArticleList?catId=',
  get_article_title_api: 'https://www.safetylaw.cn/safetyknowledge/search/getAritlcleTitle?artId=',
  get_article_api: 'https://www.safetylaw.cn/safetyknowledge/search/getAriticleInfo?artId=',
  get_total_articles: 'https://www.safetylaw.cn/safetyknowledge/search/getTotalArticles',
  get_update_list: 'https://www.safetylaw.cn/safetyknowledge/search/getUpdateList',
  search_article_api: 'https://www.safetylaw.cn/safetyknowledge/search/searchTitle?search=',
  get_hot_tag: 'https://www.safetylaw.cn/safetyknowledge/search/getHotTag',
  save_collections: 'https://www.safetylaw.cn/safetyknowledge/user/saveCollections',
  updateUserViewHistory: 'https://www.safetylaw.cn/safetyknowledge/user/updateUserViewHistory',
  updateAriticleViewtimes: 'https://www.safetylaw.cn/safetyknowledge/user/updateArticleViewtimes',
  get_aboutus: 'https://www.safetylaw.cn/safetyknowledge/project/getAboutus',
  get_home_img: 'https://www.safetylaw.cn/safetyknowledge/project/getHomeImage',
  get_open_id: 'https://www.safetylaw.cn/safetyknowledge/user/getOpenId',
  register: 'https://www.safetylaw.cn/safetyknowledge/user/register',
  get_vipperiod: 'https://www.safetylaw.cn/safetyknowledge/user/getVipperiod',
  update_vipperiod: 'https://www.safetylaw.cn/safetyknowledge/user/updateVipperiod',

  get_file_url: 'https://www.safetylaw.cn/files/',

  //49.232.32.154:8080
  get_local_file_path: 'I:\\0法律法规标准\\已整理\\',

}

//查询最新发布的列表
function queryUpdate() {
  wx.request({
    url: api_list.api_list.get_update_list,
    method: 'GET',
    success: function(res) {
      return res.data;
    }
  })
}

//点击收藏
function onCollect(e) {
  var collect = false;
  var artid = e.currentTarget.dataset.artid;
  var collection_list = wx.getStorageSync("collection_list");
  if (collection_list && collection_list.length > 0) { //已收藏列表，非空
    if (collection_list.indexOf(artid) > -1) { //已收藏中存在当前artid，用户点击取消收藏
      collect = false;
      collection_list.splice(collection_list.indexOf(artid), 1); //删除
    } else { //用户点击 收藏
      collect = true;
      collection_list.push(artid);
    }
  } else {
    collect = true;
    collection_list = [artid];
  }
  var open_id = wx.getStorageSync("openId");
  var save_collections = api_list.save_collections + "?openId=" + open_id + "&collections=" + collection_list;
  http(save_collections, function() {});
  wx.setStorageSync("collection_list", collection_list);
  convertCollectListToListItmes();

  //显示提示框
  wx.showToast({
    title: collect ? '收藏成功' : '取消成功',
    duration: 3000,
    icon: 'success'
  })
}


//将收藏信息放入listItems中，以便前台展示
function convertCollectListToListItmes(collection_list) {
  var collection_list = wx.getStorageSync("collection_list");
  var listItems = wx.getStorageSync("listItems");
  if (listItems && listItems.length > 0) {
    for (var i = 0; i < listItems.length; i++) {
      var item = listItems[i];
      var art_id = item.art_id;
      if (collection_list && collection_list.length > 0 && collection_list.indexOf(art_id) > -1) {
        item.collect = true;
      } else {
        item.collect = false;
      }
      listItems[i] = item;
    }
  }
  wx.setStorageSync("listItems", listItems);
}

function openNewPage(a) {
  var e = a.currentTarget.dataset.url;
  wx.navigateTo({
    url: e
  });
}

//打开页面
function openPage(notLogin, notVip) {
  // var notLogin = wx.getStorageSync("notLogin");
  // var notVip = wx.getStorageSync("notVip");
  var fileurl = wx.getStorageSync("fileurl");
  var artid = wx.getStorageSync("artid");
  var artpath = wx.getStorageSync("artpath");
  if (notLogin != "undefined" && notVip != "undefined" && !notLogin && !notVip) {
    // var fileurl = a.currentTarget.dataset.url;
    // var artid = a.currentTarget.dataset.artid;
    // var artpath = a.currentTarget.dataset.artpath;
    // openArticle(artid); //需要换回普通的打开方式时，此句后后面的切换即可。
    var lastName = artpath.substring(artpath.lastIndexOf(".") + 1, artpath.length);
    if (lastName == "pdf" || lastName == "PDF") {
      wx.setStorageSync('artid', artid);
      wx.setStorageSync('artpath', artpath);
      updateAriticleViewtimes(artid);
      updateUserViewHistory(artid);
      wx.navigateTo({
        url: fileurl
      });
    } else {
      openArticle(artpath, artid);
    }
  }
}

//显示loading
function showLoading(title) {
  wx.showLoading({
    title: title,
    mask: true
  })
}

//隐藏loading
function hideLoading() {
  wx.hideLoading();
}

//发送http请求
function http(url, callBack) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function(res) {
      callBack(res.data);
    },
    fail: function(error) {
      console.log(error)
    }
  })
}

//显示提示框
function showToast(title, img) {
  wx.showToast({
    title: title,
    image: img,
    duration: 2000,
  })
}

//最新的。去掉重新获取文件的过程，直接用路径下载打开文档
function openArticle(file_url, artid) {
  if (file_url && file_url != '' && file_url.length > 0) {
    var fileName = file_url.substring(file_url.lastIndexOf("\\") + 1, file_url.length);
    file_url = api_list.get_file_url + fileName;
    wx.downloadFile({ //下载到本地
      url: file_url,
      success: function(res) {
        var Path = res.tempFilePath; //得到本地地址
        wx.openDocument({ //打开文件
          filePath: Path,
          success: function(res) { //更新浏览数、我的浏览
            updateAriticleViewtimes(artid);
            updateUserViewHistory(artid);
            hideLoading();
          }
        })
      },
      fail: function(res) {
        console.log(res);
      }
    })
  } else {
    wx.showToast({
      title: '实在抱歉，该文件还没有上线 o(╥﹏╥)o ...',
    })
  }
}


//更新文章的浏览次数
function updateAriticleViewtimes(artid) {
  var url = api_list.updateAriticleViewtimes + "?artId=" + artid;
  http(url, function() {});
}

//更新用户观看历史
function updateUserViewHistory(artid) {
  artid = parseInt(artid);
  var historyList = wx.getStorageSync("history_list");
  if (historyList == null || historyList.length == 0 || historyList == '') {
    historyList = [artid];
    wx.setStorageSync("history_list", historyList)
    updateUserView(historyList);
  } else {
    if (historyList.indexOf(artid) < 0) {
      historyList.push(artid);
      wx.setStorageSync("history_list", historyList)
      updateUserView(historyList);
    }
  }
}

//更新VIP的时间
function updateVIPperiod() {
  var openId = wx.getStorageSync("openId");
  var url = api_list.update_vipperiod + "?openId=" + openId;
  http(url, function(res) {
    wx.setStorageSync("vip_left_day", res);
  });
  wx.showToast({
    title: '恭喜您已增加10天VIP权限~'
  })
}

//发请求，对用户的观看历史做更新
function updateUserView(historyList) {
  var openId = wx.getStorageSync("openId");
  var url = api_list.updateUserViewHistory + "?openId=" + openId + "&historyList=" + historyList;
  http(url, function() {});
}
/*********************用户登录 の 相关方法******************* */
//响应登录对话框中的事件
function bindGetUserInfo(e, callback) {
  if (e.detail.userInfo) {
    getSetting(callback);
  } else {
    showMustLoginTip();
  }
}

//一定要授权提示框
function showMustLoginTip() {
  wx.showModal({
    title: '警告',
    content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
    showCancel: false,
    confirmText: '返回授权',
    success: function(res) {
      // 用户没有授权成功，不需要改变 isLogin 的值
      if (res.confirm) {
        console.log('用户点击了“返回授权”');
      }
    }
  });
}

//获得用户信息
function getSetting(callback) {
  wx.getSetting({
    success: function(res) {
      if (res.authSetting['scope.userInfo']) {
        getUserInfo(res, callback);
      } else {
        that.setData({
          isLogin: true
        });
      }
    }
  });
}


//获得openid信息
function getUserInfo(e, callback) {
  wx.getUserInfo({
    success: function(res) {
      var userInfo = res.userInfo;
      wx.setStorageSync("userInfo", userInfo);
      var openId = wx.getStorageSync("openId");
      if (openId == null || openId.length == 0) {
        // showTopToast("点击 ··· 添加到我的小程序"); //显示右上角的添加收藏提示框
        wx.login({ // 获得用户的Openid
          success: res => {
            var url = api_list.get_open_id + "?code=" + res.code;
            wx.request({
              url: url,
              success: res => {
                onOpenIdComplete(res.data.openid, userInfo);
                callback(false);
              }
            });
          }
        });
      } else {
        onOpenIdComplete(openId, userInfo);
      }
    }
  });
}



//openid 获取之后，获取用户收藏和历史的数据
function onOpenIdComplete(openId, userInfo) {
  wx.setStorageSync("openId", openId);
  wx.setStorageSync("userInfo", userInfo);
  var tmp = JSON.stringify(userInfo)
  wx.request({
    url: api_list.register + "?openId=" + openId + "&nickName=" + userInfo.nickName + "&avatarUrl=" + userInfo.avatarUrl,
    method: 'GET',
    success: function(res) {
      //将收藏和历史的数据，写入缓存，后面直接用即可。
      //后面再setStorageSync的时候，要同时更新服务端数据。
      if (res.data != null) {
        var collectionList = res.data[0].collections;
        var historyList = res.data[0].histories;
        wx.setStorageSync("collection_list", collectionList);
        wx.setStorageSync("history_list", historyList);
      }
    }
  })
}

//判断是否有权限
function ifVip(callback) {
  var openId = wx.getStorageSync("openId");
  var getVipleftday = api_list.get_vipperiod + "?openId=" + openId;
  http(getVipleftday, function(res) {
    if (res == 0) { //无权限
      // that.setData({
      //   notvip: true
      // })
      callback(true);
      setTimeout(function() {
        var openId = wx.getStorageSync("openId");
        updateVIPperiod(openId); //然后更新vip权限
        callback(false);
        openPage(false, false);
      }, 10000);
    } else {
      openPage(false,false);
    }
  });
}

module.exports = {
  api_list: api_list,
  query: queryUpdate,
  onCollect: onCollect,
  openPage: openPage,
  showLoading: showLoading,
  hideLoading: hideLoading,
  http: http,
  showToast: showToast,
  convertCollectListToListItmes: convertCollectListToListItmes,
  openArticle: openArticle,
  openNewPage: openNewPage,
  updateVIPperiod: updateVIPperiod,
  getSetting: getSetting,
  bindGetUserInfo: bindGetUserInfo,
  ifVip:ifVip
}