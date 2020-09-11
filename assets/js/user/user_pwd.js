var form = layui.form;
var layer = layui.layer;
form.verify({
    pwd: [
        /^[\S]{6,12}$/
        , '密码必须6到12位，且不能出现空格！'
    ],
    // 验证新密码
    samePwd: function (value) {
        if (value === $('input[name=oldPwd]').val()) {
            return '新密码不能和原密码相同！'
        }
    },
    // 验证再次确认密码
    rePwd: function (value) {
        if (value !== $('input[name=newPwd]').val()) {
            return '两次密码输入不一致，请重新填写！'
        }
    }
})
// 给表单注册监听事件
$('#formPwd').on('submit', function (e) {
    e.preventDefault()
    // 发起ajax请求
    $.ajax({
        type: 'POST',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success: function (res) {
            if (res.status != 0) {
                return layer.msg('重置密码失败！')
            }
            layer.msg('重置密码成功！');
            // 重置表单
            $('#formPwd')[0].reset()
        }
    })
})
// bug密码不一致，token清除返回登录页

