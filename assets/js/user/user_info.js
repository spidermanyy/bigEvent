// 获取用户信息
var form = layui.form;
var layer = layui.layer;
initUserInfo();
function initUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！');
            }
            // 将获取的值赋值给表单
            form.val('formUserInfo', res.data);
            form.verify({
                nickname: function (value) {
                    if (value.length > 6) {
                        return '昵称长度必须在 1 ~ 6 个字符之间！'
                    }
                }
            })
        }
    })
}
// 给重置按钮注册点击事件
$('#resetbtn').on('click', function (e) {
    e.preventDefault();
    initUserInfo();
})

$('.layui-form').on('submit', function (e) {
    e.preventDefault();
    // 发起ajax请求
    $.ajax({
        type: 'POST',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('修改信息失败！');
            }
            layer.msg('修改信息成功！');
            window.parent.getUserInfo()
        }

    })
})
