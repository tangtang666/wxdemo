// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
var rp = require('request-promise')
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  // return rp('http://douban.uieee.com/v2/movie/in_theaters')
  // console.log(`http://douban.uieee.com/v2/movie/in_theaters?start=${event.start}&count=${event.count}`);
  return rp(`http://douban.uieee.com/v2/movie/in_theaters?start=${event.start}&count=${event.count}`)
  .then(function (res){
    // Process html...
    console.log('run it');
    console.log(res);
    return res
  })
  .catch(function (err){
    // Crawling failed...
    console.log('run err')
    console.err(err);

  });


}

