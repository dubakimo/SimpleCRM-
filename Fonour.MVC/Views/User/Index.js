var selectedId = "00000000-0000-0000-0000-000000000000";
$(function () {
    $("#btnAdd").click(function () { add(); });
    $("#btnSave").click(function () { save(); });
    $("#btnDelete").click(function () { deleteMulti(); });
    $("#checkAll").click(function () { checkAll(this) });
    initTree();
});
//全選
function checkAll(obj) {
    $(".checkboxs").each(function () {
        if (obj.checked == true) {
            $(this).prop("checked", true);
        }
        if (obj.checked == false) {
            $(this).prop("checked", false);
        }
    });
};
//加載組織機構樹
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
//加載用戶列表數據
function loadTables(startPage, pageSize) {
    $("#tableBody").html("");
    $("#checkAll").prop("checked", false);
    $.ajax({
        type: "GET",
        url: "/User/GetUserByDepartment?startPage=" + startPage + "&pageSize=" + pageSize + "&departmentId=" + selectedId + "&_t=" + new Date().getTime(),
        success: function (data) {
            $.each(data.rows, function (i, item) {
                var tr = "<tr>";
                tr += "<td align='center'><input type='checkbox' class='checkboxs' value='" + item.id + "'/></td>";
                tr += "<td>" + item.userName + "</td>";
                tr += "<td>" + (item.name == null ? "" : item.name) + "</td>";
                tr += "<td>" + (item.email == null ? "" : item.email) + "</td>";
                tr += "<td>" + (item.mobileNumber == null ? "" : item.mobileNumber) + "</td>";
                tr += "<td>" + (item.remarks == null ? "" : item.remarks) + "</td>";
                tr += "<td><button class='btn btn-info btn-xs' href='javascript:;' onclick='edit(\"" + item.id + "\")'><i class='fa fa-edit'></i> 編輯 </button> <button class='btn btn-danger btn-xs' href='javascript:;' onclick='deleteSingle(\"" + item.id + "\")'><i class='fa fa-trash-o'></i> 刪除 </button> </td>"
                tr += "</tr>";
                $("#tableBody").append(tr);
            });
            var element = $("#grid_paging_part"); //分頁插件的容器id
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
                element.bootstrapPaginator(options); //分頁插件初始化
            }
            loadRoles(data);
        }
    });
};
function loadRoles(data) {
    $("#Role").select2();
    var option = "";
    $.each(data.roles, function (i, item) {
        option += "<option value='" + item.id + "'>" + item.name + "</option>"
    });
    $("#Role").html(option);
}
//新增
function add() {
    $("#Id").val("00000000-0000-0000-0000-000000000000");
    $("#UserName").val("");
    $("#Password").val("");
    $("#Name").val("");
    $("#EMail").val("");
    $("#MobileNumber").val("");
    $("#Remarks").val("");
    $("#Role").select2("val", "");
    $("#Title").text("新增用戶");
    //彈出新增窗體
    $("#editModal").modal("show");
};
//編輯
function edit(id) {
    $.ajax({
        type: "Get",
        url: "/User/Get?id=" + id + "&_t=" + new Date().getTime(),
        success: function (data) {
            $("#Id").val(data.id);
            $("#UserName").val(data.userName);
            $("#Password").val(data.password);
            $("#Name").val(data.name);
            $("#EMail").val(data.eMail);
            $("#mobileNumber").val(data.mobileNumber);
            $("#Remarks").val(data.remarks);
            var roleIds = [];
            if (data.userRoles) {
                $.each(data.userRoles, function (i, item) {
                    roleIds.push(item.roleId)
                });
                // 只適用於 select2 單值回顯
                // $("#Role").select2("val", roleIds);
                // select2 多選值回顯方案
                $("#Role").val(roleIds).trigger("change");
            }
            $("#Title").text("編輯用戶")
            $("#editModal").modal("show");
        }
    })
};
//保存
function save() {
    var roles = "";
    if ($("#Role").val())
        roles = $("#Role").val().toString();
    var postData = { "dto": { "Id": $("#Id").val(), "UserName": $("#UserName").val(), "Password": $("#Password").val(), "Name": $("#Name").val(), "EMail": $("#EMail").val(), "MobileNumber": $("#MobileNumber").val(), "Remarks": $("#Remarks").val(), "DepartmentId": selectedId }, "roles": roles };
    $.ajax({
        type: "Post",
        url: "/User/Edit",
        data: postData,
        success: function (data) {
            if (data.result == "Success") {
                loadTables(1, 10)
                $("#editModal").modal("hide");
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
            url: "/User/DeleteMuti",
            data: sendData,
            success: function (data) {
                if (data.result == "Success") {
                    loadTables(1, 10)
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
            url: "/User/Delete",
            data: { "id": id },
            success: function (data) {
                if (data.result == "Success") {
                    loadTables(1, 10)
                    layer.closeAll();
                }
                else {
                    layer.alert("刪除失敗！");
                }
            }
        })
    });
};
