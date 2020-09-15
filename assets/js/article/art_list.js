// 获取列表信息并渲染表格
var layer = layui.layer;
var form = layui.form;
var laypage = layui.laypage;

var q = {
    pagenum: 1,     //页码值
    pagesize: 2,    //每页显示多少条数据
    cate_id: '',  //文章分类的 Id
    state: '' //文章的状态，可选值有：已发布、草稿
}

initTable();
initCate()

function initTable() {
    $.ajax({
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章列表失败！')
            }
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            // 调用渲染分页的方法
            renderPage(res.total)
        }
    })
}

// 定义时间过滤器
template.defaults.imports.dataFormat = function (date) {
    var dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}
// 定义一个补零的函数
function padZero(n) {
    return n < 10 ? '0' + n : n;
}

// 渲染分类下拉框

function initCate() {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            // console.log(res)
            if (res.status !== 0) {
                return layer.msg('获取文章分类列表失败！')
            }
            var htmlStr = template('tep_cate', res)
            // console.log(htmlStr);
            $('[name=cate_id]').html(htmlStr);
            form.render();
        }
    })
}
// 实现筛选功能
$('#formSel').on('submit', function (e) {
    e.preventDefault();
    q.cate_id = $('[name=cate_id]').val();
    q.state = $('[name=state]').val();
    initTable();
})


// 分页功能
function renderPage(total) {
    laypage.render({
        elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号
        count: total,//数据总数，从服务端得到
        limit: q.pagesize,//每页显示的条数
        curr: q.pagenum, //起始页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        // 分页发生切换的时候，触发 jump 回调
        // 触发 jump 回调的方式有两种：
        // 1. 点击页码的时候，会触发 jump 回调
        // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
        jump: function (obj, first) {
            // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
            // 如果 first 的值为 true，证明是方式2触发的
            // 否则就是方式1触发的
            // console.log(first)
            // obj.curr是最新的页码值
            // console.log(obj.curr)
            q.pagenum = obj.curr
            q.pagesize = obj.limit
            if (!first) {
                initTable()
            }
        },
    });
}

// 删除功能


$('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    // 弹出框
    layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
        //do something
        $.ajax({
            type: 'GET',
            url: '/my/article/delete/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除文章失败！')
                }
                layer.msg('删除文章成功！')
                // 判断本页是否还有数据
                if ($('.btn-delete').length === 1) {
                    q.pagenum--
                }
                initTable()
            }
        })
        layer.close(index);
    });
})

// 编辑功能
$('tbody').on('click', '.btn_edit', function () {

    var id = $(this).attr('data-id')
    $.ajax({
        type: 'GET',
        url: '/my/article/' + id,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章失败!')
            }
            location.href = 'art_edit.html?id=' + id
        }
    })
})
