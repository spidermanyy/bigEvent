// 给注册账号的a注册点击事件
$('#link_reg').on('click', function () {
    $('.loginBox').hide();
    $('.regBox').show()
})

// 给登录的a注册点击事件
$('#link_login').on('click', function () {
    $('.loginBox').show();
    $('.regBox').hide()
})

var form = layui.form;
form.verify({
    // 密码校验规则
    pass: [
        /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
    ],
    // 校验两次密码是否一致
    repwd: function (value) {
        // 通过形参拿到的是确认密码框中的内容
        var pwd = $('.regBox [name=password]').val()
        if (pwd !== value) {
            return '两次密码不一致'
        }
    }
})
// 给注册表单添加提交事件
var layer = layui.layer;
$('#regForm').on('submit', function (e) {
    e.preventDefault();
    data = {
        username: $('#regForm [name=username]').val(),
        password: $('#regForm [name=password]').val(),
    }
    $.post('/api/reguser', data, function (res) {
        if (res.status !== 0) {
            return layer.msg(res.message)
        }
        layer.msg('注册成功,请登录!');
        $('#link_login').click()
    })

})
// 给登录表单添加提交事件
$('#loginForm').submit(function (e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/api/login',
        // 获取表单的值
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('登录失败!')
            }
            layer.msg('登录成功!')
            // 讲登录成功得到的字符串存到localstorage
            localStorage.setItem('token', res.token)
            location.href = 'index.html'
        }
    })
})
