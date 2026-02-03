import {createProduct, renderNewProducts, renderHotProducts, renderAllProducts, getProductList, renderBackendProduct, syncUpdateDatabase, renderOrder, checkUser, logoutUser} from './modules/product.js';

/**
  * 關鍵字搜尋後台管理商品
  */
function FilterkeyWord_all_table() {
    let count = $(`${currentTableId}-table`).children('tbody').children('tr:first-child').children('td').length; 

    let input, filter, table, tr, td, i;
    input = document.getElementById("search-input-all");
    let input_value =     document.getElementById("search-input-all").value;
    filter = input.value.toLowerCase();
    if(input_value !=''){
        table = document.getElementById(currentTableId);
        tr = table.getElementsByTagName("tr");

        for (i = 1; i < tr.length; i++) {

            let flag = 0;

            for(j = 0; j < count; j++){
                td = tr[i].getElementsByTagName("td")[j];
                if (td) {
    
                    let td_text = td.innerHTML;  
                    if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
                        flag = 1;
                    } else {
                        //DO NOTHING
                    }
                }
            }
            if(flag==1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    } else {
        //RESET TABLE
        $('#maxRows').trigger('change');
    }
}

(function($) {

    "use strict";

    let currentTableId = '#mirror';
    /**
      * 取得分頁
      */
    function getPagination(table) {
        $('#maxRows').on('change', function() {
            $('.pagination').html('');
            let trnum = 0;
            let maxRows = parseInt($(this).val());
            
            let totalRows = $(`${table} tbody tr`).length;
            $(`${table} tr:gt(0)`).each(function() {
                trnum++;
                if (trnum > maxRows) {
                    $(this).hide();
                } else if (trnum <= maxRows) {
                    $(this).show();
                }
            });
            if (totalRows > maxRows) {
                let pagenum = Math.ceil(totalRows/maxRows);

                for (var i = 1; i <= pagenum ;) {
                    $('.pagination').append(`
                            <li data-page="${i}">
                                <span> ${i++} </span>
                            </li>
                    `).show();
                }
            }
            $('.pagination li:first-child').addClass('active');

            showing_rows_count(maxRows, 1, totalRows);

            $('.pagination li').on('click', function(e) {
                e.preventDefault();
                let pagenum = $(this).attr('data-page');
                let trIndex = 0;
                $('.pagination li').removeClass('active');
                $(this).addClass('active');

                showing_rows_count(maxRows, pagenum, totalRows);

                $(`${table} tr:gt(0)`).each(function() {
                    trIndex++;
                    if (trIndex > (maxRows*pagenum) || trIndex <= ((maxRows*pagenum)-maxRows)) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                });
            });
        });
    }
    /**
      * 顯示n筆資料
      */
    function showing_rows_count(maxRows, pageNum, totalRows) {
        let end_index = maxRows*pageNum;
        let start_index = ((maxRows*pageNum)- maxRows) + parseFloat(1);
        let string = '顯示 '+ start_index + ' 到 ' + end_index +'筆，共 ' + totalRows + ' 筆資料';
        $('.rows-count').html(string);
    }
    /**
      * 前往最後一頁
      */
    function goToLastPage(table) {
        const maxRows = parseInt($('#maxRows').val());
        const totalRows = $(`${table} tbody tr`).length; 
        if (totalRows <= maxRows) return;

        const lastPage = Math.ceil(totalRows / maxRows); 
        let trIndex = 0;

        $('.pagination li').removeClass('active');
        $('.pagination li[data-page="' + lastPage + '"]').addClass('active');

        $(`${table} tr:gt(0)`).each(function () {
            trIndex++;
            if (trIndex > (maxRows * lastPage) || trIndex <= ((maxRows * lastPage) - maxRows)) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });

        // 更新顯示行數 (如果有 showig_rows_count 函數)
        if (typeof showig_rows_count === "function") {
            showig_rows_count(maxRows, lastPage, totalRows);
        }
    }

    $(document).ready(function() {
        checkUser();

        createProduct().then(() => {
            renderBackendProduct();
            getPagination(`#mirror-table`);
            $('#maxRows').trigger('change');
        });

        renderOrder();

        $('.logout-btn').click(logoutUser);

        /**
          * 取得目前tableId
          */
        $('.nav-link').on('shown.bs.tab', function(e) {
            currentTableId = $(e.target).attr('href');
            getPagination(`${currentTableId}-table`);
            $('#maxRows').trigger('change');
        });
        /**
          * 從裝置選擇檔案上傳圖片
          */
        $(document).on('change', '.picture-input', function(e) {
            const $row = $(this).parents("tr"); // 找到目前這列
            const pictureImage = $row.find(".picture-image");
            const pictureImageTxt = "Upload";

            const inputTarget = e.target;
            const file = inputTarget.files[0];

            if (file) {
                const reader = new FileReader();

                reader.addEventListener("load", function (e) {
                    const readerTarget = e.target;

                    const img = $("<img>")
                        .attr("src", readerTarget.result)
                        .addClass("picture-img");

                    pictureImage.html(""); // 清空內容
                    pictureImage.append(img); // 插入圖片
                });

                reader.readAsDataURL(file);
            } else {
                pictureImage.html(pictureImageTxt);
            }
        });
        /**
          * Table新增一行按鈕
          */
        $('.add-new').click(function() {
            let $tbody = $(`${currentTableId}-table tbody`);
            let index = $tbody.find('tr').length + 1;
            let inputId = "picture-" + currentTableId + "-" + index;

            let act_div =   '<a class="add" data-toggle="tooltip"><svg width="28" height="28" viewBox="0 0 28 28"><use xlink:href="#add"></use></svg></a>' + 
                            '<a class="edit" data-toggle="tooltip"><svg width="28" height="28" viewBox="0 0 28 28"><use xlink:href="#edit"></use></svg></a>' + 
                            '<a class="delete" data-toggle="tooltip"><svg width="28" height="28" viewBox="0 0 28 28"><use xlink:href="#delete"></use></svg></a>';

            let img_div = `
                            <label class="picture" for="${inputId}" + tabIndex="0">
                                <span class="picture-image">Upload</span>
                            </label>
                            <input type="file" class="picture-input" id="${inputId}">
                        `;

            let row = `
                <tr>
                    <td>${index}</td>
                    <td>${img_div}</td>
                    <td><input type="text" class="form-control text-center" name="feature" id="feature"></td>
                    <td><input type="text" class="form-control text-center" name="price" id="price"></td>
                    <td><input type="text" class="form-control text-center" name="quantity" id="quantity"></td>
                    <td><input type="checkbox" class="form-check-input" name="jarr" id="jarr"></td>
                    <td><input type="checkbox" class="form-check-input" name="hot" id="hot"></td>
                    <td>${act_div}</td>
                </tr>
            `;
            $tbody.append(row);
            $tbody.find("tr:last-child").find(".add, .edit").toggle();
            $('[data-toggle="tooltip"]').tooltip();
            $(this).attr("disabled", "disabled");

            getPagination(`${currentTableId}-table`);
            $('#maxRows').trigger('change');
            goToLastPage(currentTableId);
        });
        /**
          * Table確定新增按鈕
          */
        $(document).on('click', '.add', function() {
            let empty = false;
            let input = $(this).parents("tr").find('input[type="text"]');
            input.each(function(){
                if(!$(this).val()){
                    $(this).addClass("error");
                    empty = true;
                } else{
                    $(this).removeClass("error");
                }
            });

            $(this).parents("tr").find(".error").first().focus();
            if(!empty){
                input.each(function(){
                    $(this).parent("td").html($(this).val());
                });	
                
                $(this).parents("tr").find(".add, .edit").toggle();
                $(this).parents("tr").find(".picture-input").attr("disabled", "disabled");
                $(this).parents("tr").find(".jarr").attr("disabled", "disabled");
                $(this).parents("tr").find(".hot").attr("disabled", "disabled");
                $(".add-new").removeAttr("disabled");
            }		
        });
        /**
          * Table編輯按鈕
          */
        $(document).on('click', '.edit', function() {
            $(this).parents("tr").find("td:not(:last-child):not(:eq(0),:eq(1),:eq(5),:eq(6))").each(function(){
                $(this).html('<input type="text" class="form-control text-center" value="' + $(this).text() + '">');
            });

            $(this).parents('tr').find('.add, .edit').toggle();
            $(this).parents("tr").find(".picture-input").removeAttr("disabled");
            $(this).parents("tr").find(".jarr").removeAttr("disabled");
            $(this).parents("tr").find(".hot").removeAttr("disabled");
            $(".add-new").attr("disabled", "disabled");
        });
        /**
          * Table刪除按鈕
          */
        $(document).on('click', '.delete', function() {
            $(this).parents('tr').remove();
            $('.add-new').removeAttr('disabled');
            getPagination(`${currentTableId}-table`);
            $('#maxRows').trigger('change');
        });
        /**
          * 上傳圖片與表格資料
          */
        $(document).on('click', '.upload-btn', function(e) {
            e.preventDefault();

            // 二次確認
            const ok = window.confirm(
                "將同步所有分頁的圖片與資料到雲端，確定要繼續嗎？"
            );
            if (!ok) return; // 取消就直接不做
            
            const $btn = $(this);
            $btn.prop("disabled", true).text("同步中...");

            try {
                syncUpdateDatabase();
                alert("所有圖片與表格同步完成！");
            } catch (err) {
                console.error(err);
                alert("同步過程發生錯誤。");
            } finally {
                $btn.prop("disabled", false).text("儲存全部資料");
            }
        });
    });
})(jQuery);