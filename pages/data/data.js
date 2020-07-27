var api_list = {
  //获得分类信息
  get_category_api: 'https://www.safetylaw.cn/safetyknowledge/search/getCategory',
  //通过catid得到文章列表
  get_article_list_api: 'https://www.safetylaw.cn/safetyknowledge/search/getArticleList?catId=',
  //通过catId得到文件标题
  get_article_title_api: 'https://www.safetylaw.cn/safetyknowledge/search/getAritlcleTitle?artId=',
  //通过artid得到文章详情
  get_article_api: 'https://www.safetylaw.cn/safetyknowledge/search/getAriticleInfo?artId=',
  //搜索，得到相关的文章总数
  get_total_articles: 'https://www.safetylaw.cn/safetyknowledge/search/getTotalArticles',
  //得到最新文章列表
  get_update_list: 'https://www.safetylaw.cn/safetyknowledge/search/getUpdateList',
  //搜索文章标题
  search_article_api: 'https://www.safetylaw.cn/safetyknowledge/search/searchTitle?search=',
  //得到所有标签
  get_hot_tag: 'https://www.safetylaw.cn/safetyknowledge/search/getHotTag',
  //保存收藏
  save_collections: 'https://www.safetylaw.cn/safetyknowledge/user/saveCollections',
  //更新用户浏览历史
  updateUserViewHistory: 'https://www.safetylaw.cn/safetyknowledge/user/updateUserViewHistory',
  //更新文章被浏览的次数
  updateAriticleViewtimes: 'https://www.safetylaw.cn/safetyknowledge/user/updateArticleViewtimes',
  //得到关于我们
  get_aboutus: 'https://www.safetylaw.cn/safetyknowledge/project/getAboutus',
  //得到主页的轮播图
  get_home_img: 'https://www.safetylaw.cn/safetyknowledge/project/getHomeImage',
  //请求用户的openId
  get_open_id: 'https://www.safetylaw.cn/safetyknowledge/user/getOpenId',
  //用户登录
  register: 'https://www.safetylaw.cn/safetyknowledge/user/register',
  //得到用户的vip时间
  get_vipperiod: 'https://www.safetylaw.cn/safetyknowledge/user/getVipperiod',
  //点击分享以后，更新用户的vip时间
  update_vipperiod: 'https://www.safetylaw.cn/safetyknowledge/user/updateVipperiod',

  //隐患排查：获得分类信息
  get_requirements_category: 'https://www.safetylaw.cn/safetyknowledge/hiddendanager/getCategory',

  //隐患排查：得到最后面一层分类
  get_requierments_last_category: 'https://www.safetylaw.cn/safetyknowledge/hiddendanager/getLastCategory?upperCatId=',

  //隐患排查：通过keyword和catlist进行安全要求的检索
  search_requirements: 'https://www.safetylaw.cn/safetyknowledge/hiddendanager/getRequirementsByKeywords?keywords=',

  //通过reqid得到所有的安全要求
  search_requirements_by_id: 'https://www.safetylaw.cn/safetyknowledge/hiddendanager/getRequirementsByIds?reqid=',

  save_hcollections: 'https://www.safetylaw.cn/safetyknowledge/user/saveHCollections',
  save_hagree: 'https://www.safetylaw.cn/safetyknowledge/user/saveHAgree',
  //服务器ip: 49.232.32.154:8080

  get_file_url: 'https://www.safetylaw.cn/files/',
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

//法律法规：点击收藏按钮
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

//安全要求：点击收藏按钮
function onHCollect(e) {
  var collect = false;
  var reqid = e.currentTarget.dataset.reqid;
  var collection_list = wx.getStorageSync("h_collection");
  if (collection_list && collection_list.length > 0) { //已收藏列表，非空
    if (collection_list.indexOf(reqid) > -1) { //已收藏中存在当前artid，用户点击取消收藏
      collect = false;
      collection_list.splice(collection_list.indexOf(reqid), 1); //删除
    } else { //用户点击 收藏
      collect = true;
      collection_list.push(reqid);
    }
  } else {
    collect = true;
    collection_list = [reqid];
  }
  var open_id = wx.getStorageSync("openId");
  var save_collections = api_list.save_hcollections + "?openId=" + open_id + "&HCollections=" + collection_list;
  http(save_collections, function() {});
  wx.setStorageSync("h_collection", collection_list);
  convertHCollectAndAgreeToListItmes();

  //显示提示框
  wx.showToast({
    title: collect ? '收藏成功' : '取消成功',
    duration: 3000,
    icon: 'success'
  })
}

//安全要求：点赞按钮
function onHAgree(e) {
  var agree = false;
  var reqid = e.currentTarget.dataset.reqid;
  var agree_list = wx.getStorageSync("h_agree");
  if (agree_list && agree_list.length > 0) { //已收藏列表，非空
    if (agree_list.indexOf(reqid) > -1) { //已收藏中存在当前artid，用户点击取消收藏
      agree = false;
      agree_list.splice(agree_list.indexOf(reqid), 1); //删除
    } else { //用户点击 收藏
      agree = true;
      agree_list.push(reqid);
    }
  } else {
    agree = true;
    agree_list = [reqid];
  }
  var open_id = wx.getStorageSync("openId");
  var save_agree = api_list.save_hagree + "?openId=" + open_id + "&HAgree=" + agree_list;
  http(save_agree, function() {});
  wx.setStorageSync("h_agree", agree_list);
  convertHCollectAndAgreeToListItmes();

  //显示提示框
  wx.showToast({
    title: agree ? '点赞成功' : '取消点赞',
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

//将安全要求部分的收藏和点赞放入list_Item中，以便前台展示
function convertHCollectAndAgreeToListItmes() {
  var h_collection = wx.getStorageSync("h_collection");
  var h_agree = wx.getStorageSync("h_agree");
  var listItems = wx.getStorageSync("h_listItems");
  if (listItems && listItems.length > 0) {
    for (var i = 0; i < listItems.length; i++) {
      var item = listItems[i];
      var reqId = item.reqId;
      //收藏的加入
      if (h_collection && h_collection.length > 0 && h_collection.indexOf(reqId) > -1) {
        item.collect = true;
      } else {
        item.collect = false;
      }

      //点赞加入
      if (h_agree && h_agree.length > 0 && h_agree.indexOf(reqId) > -1) {
        item.agree = true;
      } else {
        item.agree = false;
      }
      listItems[i] = item;
    }
  }
  wx.setStorageSync("h_listItems", listItems);
}


function openNewPage(a) {
  var e = a.currentTarget.dataset.url;
  wx.navigateTo({
    url: e
  });
}

//打开页面
function openPage(notLogin, notVip) {
  showLoading("正在加载...");
  var fileurl = wx.getStorageSync("fileurl");
  var artid = wx.getStorageSync("artid");
  var artpath = wx.getStorageSync("artpath");
  if (notLogin != "undefined" && notVip != "undefined" && !notLogin && !notVip) {
    var lastName = artpath.substring(artpath.lastIndexOf(".") + 1, artpath.length);
    if (lastName == "pdf" || lastName == "PDF") {
      wx.setStorageSync('artid', artid);
      wx.setStorageSync('artpath', artpath);
      updateAriticleViewtimes(artid);
      updateUserViewHistory(artid);
      hideLoading();
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
        var path = res.tempFilePath; //得到本地地址
        hideLoading();
        wx.openDocument({ //打开文件
          filePath: path,
          success: function(res) { //更新浏览数、我的浏览
            updateAriticleViewtimes(artid);
            updateUserViewHistory(artid);
          }
        })
      },
      fail: function(res) {
        console.log(file_url);
        hideLoading();
        wx.showToast({
          title: '实在抱歉，该文件有点问题，我们正在极力修复...',
        })
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
        var hid_collections = res.data[0].hid_collections;
        var hid_agree = res.data[0].hid_agree;
        wx.setStorageSync("collection_list", collectionList);
        wx.setStorageSync("history_list", historyList);
        wx.setStorageSync("h_agree", hid_agree);
        wx.setStorageSync("h_collections", hid_collections);
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
      callback(true);
      setTimeout(function() {
        var openId = wx.getStorageSync("openId");
        updateVIPperiod(openId); //然后更新vip权限
        callback(false);
        openPage(false, false);
      }, 10000);
    } else {
      openPage(false, false);
    }
  });
}

//隐患排查：查看是否有VIP权限，与上面方法的不用是，这个不用打开文章
function hiddenIfVip(callback) {
  var openId = wx.getStorageSync("openId");
  var getVipleftday = api_list.get_vipperiod + "?openId=" + openId;
  console.log(getVipleftday);
  http(getVipleftday, function(res) {
    console.log(res);
    if (res <= 0) { //无权限
      callback(true);
      console.log("not vip");
      setTimeout(function() {
        var openId = wx.getStorageSync("openId");
        updateVIPperiod(openId); //然后更新vip权限
        callback(false); //返回
      }, 10000);
    } else {
      callback(false);
    }
  });

}

module.exports = {
  api_list: api_list,
  query: queryUpdate,
  onCollect: onCollect, //法律法规：点击收藏按钮
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
  ifVip: ifVip,
  convertHCollectAndAgreeToListItmes: convertHCollectAndAgreeToListItmes, //安全要求：数据转换
  onHCollect: onHCollect, //安全要求：点击收藏
  onHAgree: onHAgree,
  hiddenIfVip: hiddenIfVip, //安全要求：判断是否有VIP权限
  onOpenIdComplete: onOpenIdComplete //用户登录后，获取用户数据
}