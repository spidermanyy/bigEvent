
var layer = layui.layer;
var form = layui.form;

// 裁剪区域
// 1. 初始化图片裁剪器
var $image = $('#image')

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}

initCate()
initEditor()
// 加载文章分类
function initCate() {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章分类失败！')
            }
            var htmlStr = template('tpl_cate', res)
            // 一定要调用form.render()重新渲染
            $('[name=cate_id]').html(htmlStr);
            form.render();
            // 分类数据初始化完成之后，再加载文章详细数据
            // 如果提前加载，可能导致下拉选择框无法选中当前文章分类
            initArticle()
        }
    })
}

// 获取文章信息填充表单
// console.log(location.search)
var seach = location.search.split('=')
var id = seach[1]
// console.log(seach)

// 初始化文章数据
function initArticle() {
    $.ajax({
        url: "/my/article/" + id,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('初始化文章数据失败！')
            }
            console.log(res)
            form.val('form_edit', res.data)

            // 初始化富文本编辑器
            initEditor()
            // 初始化裁剪区域
            // 必须获取完文章数据之后才能够初始化，确保在裁剪区域展示原始文章封面
            initImage(res.data.cover_img)
        }
    });
}

// 初始化裁剪区域
function initImage(path) {
    // 如果存在图片路径，就将路径设置给img标签
    if (path) {
        $image.attr('src', 'http://ajax.frontend.itheima.net' + path)
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
}


// 给选择封面按钮注册点击事件
$('#chooseImage').on('click', function () {
    $('#coverfile').click()
})

// 给file标签设置change事件
$('#coverfile').on('change', function (e) {
    var files = e.target.files
    // console.log(files)
    if (files.length === 0) {
        return layer.msg('请选择一张图片！')
    }
    // 1、拿到用户选择的文件
    var file = e.target.files[0]
    // 2、根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file)
    // 3、先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域

})




var btn_state = '已发布'
// 给存为草稿按钮注册事件
$('#saveBtn').on('click', function () {
    btn_state = '草稿'
})




// 监听表单提交事件
$('#form_edit').on('submit', function (e) {
    e.preventDefault()
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0])
    // 3. 将文章的发布状态，存到 fd 中
    fd.append('state', btn_state)
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob)
            console.log(fd)
            // 6. 发起 ajax 数据请求
            $.ajax({
                type: 'POST',
                url: '/my/article/add',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败！')
                    }
                    layer.msg('发布文章成功！')
                    location.href = 'art_list.html'
                }
            })
        })



})