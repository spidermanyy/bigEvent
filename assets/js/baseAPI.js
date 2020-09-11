// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://ajax.frontend.itheima.net' + options.url;

  // 统一为有权限的接口设置headers请求头
  // console.log(options)
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  // 全局统一挂载complete函数
  // 不管请求是否成功，都会执行这个函数
  options.complete = function (res) {
    // console.log(res)
    if (res.responseJSON.status !== 0 && res.responseJSON.message !== '获取用户基本信息成功！') {
      // 删除本地内存中保存的token数据
      localStorage.removeItem('token');
      // 跳转到登录
      location.href = '/login.html';
    }
  }
})
