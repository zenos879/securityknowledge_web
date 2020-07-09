var api = require('../data/data.js');
Page({

  data: {
    curSecondCate: 0, //当前页面的父 二级分类
    curThirdCate: 0, //当前高亮的三级分类
    thirdCateList: {}, //当前所有三级分类的列表
    curCnt: {}, //当前分类的数据
  },

  getCurCnt: function() {
    var that = this;
    var tmp = [{
      'keyword': '固定式压力容器，管理制度',
      'requirements': '工作票、操作票“两票”齐全有效，记录至少保存一年。',
      'source': 'GB50016-2012建筑设计防火规范3.3.8',
      'collect': '1200',
      'agree': '1499'
    }, {
        'keyword': '固定式压力容器，管理制度',
        'requirements': '有可模拟操作的模拟图板或设施,并与实际运行方式相符。',
        'source': 'GB50016-2012建筑设计防火规范3.3.8',
        'collect': '1200',
        'agree': '1499'
      }, {
        'keyword': '固定式压力容器，管理制度',
        'requirements': '有可模拟操作的模拟图板或设施,并与实际运行方式相符。',
        'source': 'GB50016-2012建筑设计防火规范3.3.8',
        'collect': '1200',
        'agree': '1499'
      }, {
        'keyword': '固定式压力容器，管理制度',
        'requirements': '有可模拟操作的模拟图板或设施,并与实际运行方式相符。',
        'source': 'GB50016-2012建筑设计防火规范3.3.8',
        'collect': '1200',
        'agree': '1499'
      }];
    that.setData({
      curCnt: tmp
    })
  },


  //获得三级分类列表
  getThirdCateList: function() {
    var that = this;
    var o = [{
      'sub_cate_id': 0,
      'sub_cate_name': '全部'
    }, {
      'sub_cate_id': 1,
      'sub_cate_name': '安全管理'
    }, {
      'sub_cate_id': 2,
      'sub_cate_name': '建筑与环境'
    }, {
      'sub_cate_id': 3,
      'sub_cate_name': '变压器、发电机'
    }, {
      'sub_cate_id': 4,
      'sub_cate_name': '高低压配电装置、电容器'
    }, {
      'sub_cate_id': 5,
      'sub_cate_name': '固定电气线路'
    }];
    that.setData({
      thirdCateList: o
    })
  },


  onLoad: function(options) {
    api.showLoading("正在加载...");
    //首先获得三级目录，初始化上面的滚动条
    this.getThirdCateList();
    //然后加载二级目录下，全部的数据
    this.getCurCnt();
    api.hideLoading();
  },

  onShareAppMessage: function() {
    var path = "/pages/checkrules/checkrules";
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