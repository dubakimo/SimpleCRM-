var selectedRole = 0;
$(function () {
    $("#btnAdd").click(function () { add(); });
    $("#btnDelete").click(function () { deleteMulti(); });
    $("#btnSave").click(function () { save(); });
    $("#btnSavePermission").click(function () { savePermission(); });
    $("#checkAll").click(function () { checkAll(this) });
    initTree();
    loadTables(1, 10);
});
//加載樹
function initTree() {
    $.jstree.destroy();
    $.ajax({
        type: "Get",
        url: "/Menu/GetMenuTreeData?_t=" + new Date().getTime(),    //獲取數據的ajax請求地址
        success: function (data) {
            $('#treeDiv').jstree({       //創建JsTtree
                'core': {
                    'data': data,        //綁定JsTree數據
                    "multiple": true    //是否多選
                },
                "plugins": ["state", "types", "wholerow", "checkbox",],  //配置信息
                "checkbox": {
                    "keep_selected_style": false
                }
            })
            $("#treeDiv").on("ready.jstree", function (e, data) {   //樹創建完成事件
                data.instance.open_all();    //展開所有節點
            });
        }
    });

}
//加載列表數據
function loadTables(startPage, pageSize) {
    $("#tableBody").html("");
    $("#checkAll").prop("checked", false);
    $.ajax({
        type: "GET",
        url: "/Role/GetAllPageList?startPage=" + startPage + "&pageSize=" + pageSize + "&_t=" + new Date().getTime(),
        success: function (data) {
            $.each(data.rows, function (i, item) {
                var tr = "<tr>";
                tr += "<td align='center'><input type='checkbox' class='checkboxs' value='" + item.id + "'/></td>";
                tr += "<td>" + (item.code == null ? "" : item.code) + "</td>";
                tr += "<td>" + item.name + "</td>";
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
            $("table > tbody > tr").click(function () {
                $("table > tbody > tr").removeAttr("style")
                $(this).attr("style", "background-color:#beebff");
                selectedRole = $(this).find("input").val();
                loadPermissionByRole(selectedRole);
            });
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
function add() {
    $("#Id").val("00000000-0000-0000-0000-000000000000");
    $("#Code").val("");
    $("#Name").val("");
    $("#Remarks").val("");
    $("#Title").text("新增角色");
    //彈出新增窗體
    $("#editModal").modal("show");
};
//編輯
function edit(id) {
    $.ajax({
        type: "Get",
        url: "/Role/Get?id=" + id + "&_t=" + new Date().getTime(),
        success: function (data) {
            $("#Id").val(data.id);
            $("#Name").val(data.name);
            $("#Code").val(data.code);
            $("#Remarks").val(data.remarks);

            $("#Title").text("編輯角色")
            $("#editModal").modal("show");
        }
    })
};
//保存
function save() {
    var postData = { "dto": { "Id": $("#Id").val(), "Name": $("#Name").val(), "Code": $("#Code").val(), "Remarks": $("#Remarks").val() } };
    $.ajax({
        type: "Post",
        url: "/Role/Edit",
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
            url: "/Role/DeleteMuti",
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
            url: "/Role/Delete",
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
//保存角色權限關聯關系
function savePermission() {
    if (selectedRole == 0) {
        layer.alert("請選擇角色。");
        return;
    }
    var checkedMenu = $('#treeDiv').jstree().get_checked(true);
    var permissions = [];
    $.each(checkedMenu, function (i, item) {
        permissions.push({ "RoleId": selectedRole, "MenuId": item.id });
    })
    $.ajax({
        type: "POST",
        url: "/Role/SavePermission",
        data: { "roleId": selectedRole, "roleMenus": permissions },
        success: function (data) {
            if (data.result = true) {
                layer.alert("保存成功！");
            }
            else {
                layer.alert("保存失敗！");
            }
        }
    })
};
//根據選中角色加載功能權限
function loadPermissionByRole(selectedRole) {
    $.ajax({
        type: "Get",
        url: "/Role/GetMenusByRole?roleId=" + selectedRole + "&_t=" + new Date().getTime(),
        success: function (data) {
            $("#treeDiv").find("li").each(function () {
                $("#treeDiv").jstree("uncheck_node", $(this));
                if (data.indexOf($(this).attr("id")) != -1) {
                    $("#treeDiv").jstree("check_node", $(this));
                }
            })
        }
    });
};
