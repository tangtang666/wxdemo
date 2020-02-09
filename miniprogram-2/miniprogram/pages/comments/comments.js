// pages/comments/comments.js
const db = wx.cloud.database(); // 初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    content:'',//评价的内容
    score: 5, // 评价的分数
    images: [], // 上传的图片
    fileIds:[],
    movieId: -1
  },
  submit: function(){
    console.log(this.data.content)
    console.log(this.data.score)
    wx.showLoading({
      title: '评论中',
    })
    // 上传图片到云存储
    let promiseArr = [];
    for (let i =0; i< this.data.images.length; i++){
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0];// 正则表达式，返回文件扩展名
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
        success: res => {
          // get resource ID
          console.log(res.fileID)
          this.setData({
            fileIds:this.data.fileIds.concat(res.fileID)
          });
          reslove();
        },
          fail: console.error
        })
      }));
    }
    Promise.all(promiseArr).then(res => {
      // 插入数据
      db.collection('comments').add({
        data: {
          content: this.data.content,
          score: this.data.score,
          movieid: this.data.movieId,
          fileIds: this.data.fileIds
        }
      }).then(res =>{
        wx.hideLoading();
        wx.showToast({
          title: '评论成功',
        })
      }).catch(err =>{
        console.error(err);
        
        wx.hideLoading();
        wx.showToast({
          title: '评论失败',
        })
      })

    });
  },
  onContentChange: function(event){
    this.setData({
      content: event.detail
    });

  },
  onScoreChange: function(event){
    this.setData({
      score : event.detail
    });
  },
  uploadImg: function(){
      // 选择图片
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)
          this.setData({
              //  images : tempFilePaths
              images : this.data.images.concat(tempFilePaths)
          });
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      movieId: options.movieid
    }),
    wx.cloud.callFunction({
      name: 'getDetail',
      data:{
        movieid: options.movieid
      }
    }).then(res => {
      console.log(res);
      wx.hideLoading();
      this.setData({
        detail: JSON.parse(res.result)
      });
      
    }).catch(err =>{
      wx.hideLoading();
      console.error(err);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})