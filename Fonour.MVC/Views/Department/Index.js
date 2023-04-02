﻿var selectedId = "00000000-0000-0000-0000-000000000000";
$(function () {
    $("#btnAddRoot").click(function () { add(0); });
    $("#btnAdd").click(function () { add(1); });
    $("#btnSave").click(function () { save(); });
    $("#btnDelete").click(function () { deleteMulti(); });
    $("#btnLoadRoot").click(function () {
        selectedId = "00000000-0000-0000-0000-000000000000";
        loadTables(1, 10);
    });
    $("#checkAll").click(function () { checkAll(this) });
    initTree();
});
//加載功能樹
function initTree() {
    $.jstree.destroy();
    $.ajax({
        type: "Get",
        url: "/Department/GetTreeData?_t=" + new Date().getTime(),    //獲取數據的ajax請求地址
        success: function (data) {
            $('#treeDiv').jstree({       //創建JsTtree
                'core': {
                    'data': data,        //綁定JsTree數據
                    "multiple": false    //是否多選
                },
                "plugins": ["state", "types", "wholerow"]  //配置信息
            })
            $("#treeDiv").on("ready.jstree", function (e, data) {   //樹創建完成事件
                data.instance.open_all();    //展開所有節點
            });
            $("#treeDiv").on('changed.jstree', function (e, data) {   //選中節點改變事件
                var node = data.instance.get_node(data.selected[0]);  //獲取選中的節點
                if (node) {
                    selectedId = node.id;
                    loadTables(1, 10);
                };
            });
        }
    });

}
//加載功能列表數據
function loadTables(startPage, pageSize) {
    $("#tableBody").html("");
    $("#checkAll").prop("checked", false);
    $.ajax({
        type: "GET",
        url: "/Department/GetChildrenByParent?startPage=" + startPage + "&pageSize=" + pageSize + "&parentId=" + selectedId + "&_t=" + new Date().getTime(),
        success: function (data) {
            $.each(data.rows, function (i, item) {
                var tr = "<tr>";
                tr += "<td align='center'><input type='checkbox' class='checkboxs' value='" + item.id + "'/></td>";
                tr += "<td>" + item.name + "</td>";
                tr += "<td>" + (item.code == null ? "" : item.code) + "</td>";
                tr += "<td>" + (item.manager == null ? "" : item.manager) + "</td>";
                tr += "<td>" + (item.contactNumber == null ? "" : item.contactNumber) + "</td>";
                tr += "<td>" + (item.remarks == null ? "" : item.remarks) + "</td>";
                tr += "<td><button class='btn btn-info btn-xs' href='javascript:;' onclick='edit(\"" + item.id + "\")'><i class='fa fa-edit'></i> 編輯 </button> <button class='btn btn-danger btn-xs' href='javascript:;' onclick='deleteSingle(\"" + item.id + "\")'><i class='fa fa-trash-o'></i> 刪除 </button> </td>"
                tr += "</tr>";
                $("#tableBody").append(tr);
            })
            var elment = $("#grid_paging_part"); //分頁插件的容器id
            if (data.rowCount > 0) {
                var options = { //分頁插件配置項
                    bootstrapMajorVersion: 3,
                    currentPage: startPage, //當前頁
                    numberOfPages: data.rowsCount, //總數
                    totalPages: data.pageCount, //總頁數
                    onPageChanged: function (event, oldPage, newPage) { //頁面切換事件
                        loadTables(newPage, pageSize);
                    }
                }
                elment.bootstrapPaginator(options); //分頁插件初始化
            }
        }
    })
}
//全選
function checkAll(obj) {
    $(".checkboxs").each(function () {
        if (obj.checked == true) {
            $(this).prop("checked", true)

        }
        if (obj.checked == false) {
            $(this).prop("checked", false)
        }
    });
};
//新增
function add(type) {
    if (type === 1) {
        if (selectedId === "00000000-0000-0000-0000-000000000000") {
            layer.alert("請選擇部門。");
            return;
        }
        $("#ParentId").val(selectedId);
    }
    else {
        $("#ParentId").val("00000000-0000-0000-0000-000000000000");
    }
    $("#Id").val("00000000-0000-0000-0000-000000000000");
    $("#Code").val("");
    $("#Name").val("");
    $("#Manager").val("");
    $("#ContactNumber").val("");
    $("#Remarks").val("");
    $("#Title").text("新增頂級");
    //彈出新增窗體
    $("#addRootModal").modal("show");
};
//編輯
function edit(id) {
    $.ajax({
        type: "Get",
        url: "/Department/Get?id=" + id + "&_t=" + new Date().getTime(),
        success: function (data) {
            $("#Id").val(data.id);
            $("#ParentId").val(data.parentId);
            $("#Name").val(data.name);
            $("#Code").val(data.code);
            $("#Manager").val(data.manager);
            $("#ContactNumber").val(data.contactNumber);
            $("#Remarks").val(data.remarks);

            $("#Title").text("編輯功能")
            $("#addRootModal").modal("show");
        }
    })
};
//保存
function save() {
    var postData = { "dto": { "Id": $("#Id").val(), "ParentId": $("#ParentId").val(), "Name": $("#Name").val(), "Code": $("#Code").val(), "Manager": $("#Manager").val(), "ContactNumber": $("#ContactNumber").val(), "Remarks": $("#Remarks").val() } };
    $.ajax({
        type: "Post",
        url: "/Department/Edit",
        data: postData,
        success: function (data) {
            debugger
            if (data.result == "Success") {
                initTree();
                $("#addRootModal").modal("hide");
            } else {
                layer.tips(data.message, "#btnSave");
            };
        }
    });
};
//批量刪除
function deleteMulti() {
    var ids = "";
    $(".checkboxs").each(function () {
        if ($(this).prop("checked") == true) {
            ids += $(this).val() + ","
        }
    });
    ids = ids.substring(0, ids.length - 1);
    if (ids.length == 0) {
        layer.alert("請選擇要刪除的記錄。");
        return;
    };
    //詢問框
    layer.confirm("您確認刪除選定的記錄嗎？", {
        btn: ["確定", "取消"]
    }, function () {
        var sendData = { "ids": ids };
        $.ajax({
            type: "Post",
            url: "/Department/DeleteMuti",
            data: sendData,
            success: function (data) {
                if (data.result == "Success") {
                    initTree();
                    layer.closeAll();
                }
                else {
                    layer.alert("刪除失敗！");
                }
            }
        });
    });
};
//刪除單條數據
function deleteSingle(id) {
    layer.confirm("您確認刪除選定的記錄嗎？", {
        btn: ["確定", "取消"]
    }, function () {
        $.ajax({
            type: "POST",
            url: "/Department/Delete",
            data: { "id": id },
            success: function (data) {
                if (data.result == "Success") {
                    initTree();
                    layer.closeAll();
                }
                else {
                    layer.alert("刪除失敗！");
                }
            }
        })
    });
};


