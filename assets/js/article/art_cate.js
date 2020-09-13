// 获取文章分类列表
var layer = layui.layer;
var form = layui.form;
initArtList();
function initArtList() {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            var htmlStr = template('art-tep', res)
            $('tbody').html(htmlStr)
        }
    })
}
// 给添加按钮添加点击事件
var indexAdd = null;
$('#addBtn').on('click', function () {
    // 设置弹窗
    indexAdd = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $('#dialog-add').html()
    })
})
// 通过事件委托为form表单绑定submit事件
$('body').on('submit', '#formAdd', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/my/article/addcates',
        data: $(this).serialize(),
        success: function (res) {
            if (res.status != 0) {
                return layer.msg('新增文章分类失败！')
            }
            initArtList();
            layer.msg('新增文章分类成功！')
            // 根据索引关闭弹出层
            layer.close(indexAdd)
        }
    })
})


// 修改功能:根据自定义属性找到id对应的数据,先获取数据赋值给表单，再修改提交数据
// 通过委托给编辑按钮绑定点击事件
var indexEdit = null;
$('tbody').on('click', '.eidtBtn', function (e) {
    // e.preventDefault();
    // 设置弹窗
    indexEdit = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '修改文章分类',
        content: $('#dialog-edit').html()
    })
    var Id = $(this).attr('data-id')
    // 获取数据
    $.ajax({
        type: 'GET',
        url: '/my/article/cates/' + Id,
        success: function (res) {
            form.val('form-edit', res.data)
        }
    })
})

// 通过事件委托给修改按钮绑定提交事件
$('body').on('submit', '#formEdit', function (e) {
    e.preventDefault();
    // 发起ajax请求
    $.ajax({
        type: 'POST',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('更新分类信息失败！')
            }
            initArtList();
            layer.close(indexEdit)
            layer.msg('更新分类信息成功！')

        }
    })
})

// 删除功能
$('tbody').on('click', '.delBtn', function (res) {
    var id = $(this).attr('data-id');

    layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
        //do something
        $.ajax({
            type: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除文章分类失败！')
                }
                layer.msg('删除文章分类成功！')
                console.log(indexEdit);
                initArtList();
                layer.close(index);
            }
        })

    });


})
