// 获取用户的信息
getUserInfo();
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // headers是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res)
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            renderAvator(res.data)
            // 渲染用户头像
            // 如果有昵称就用昵称，没有就用用户名
        },

    })
}
// 渲染头像
function renderAvator(user) {
    var name = user.nickname || user.username;
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        // 渲染图像头像
        $('.text-avator').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avator').html(first).show()
    }

}




// 实现退出功能
var layer = layui.layer;


$('.logOut').on('click', function () {
    // 弹出框
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
        //do something
        // 删除本地内存中保存的token数据
        localStorage.removeItem('token');
        // 跳转到登录
        location.href = '/login.html';
        // 关闭confirm弹窗
        layer.close(index);
    });

})