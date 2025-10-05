/**
   * supabase api全域變數
   */
const supabaseUrl = "https://yvemaakibhtbtohrenjc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZW1hYWtpYmh0YnRvaHJlbmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTg2NjMsImV4cCI6MjA3MTQzNDY2M30.gjCwUCG2onNhKjaHLPRrAz6NpWOq6TcdXsdcF3deYVY"; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const folderMap = {
  mirrorTable:   "mirror",
  magnetTable:   "magnet",
  coasterTable:  "coaster",
  woodTable:     "wood",
  paintingTable: "painting"
};

let currentTableId = "mirrorTable"; // 預設第一個 table

/**
   * apexcharts變數
   */
/*var options_sales_overview = {
        series: [
        {
            name: "Ample Admin",
            data: [355, 390, 300, 350, 390],
        },
        {
            name: "Pixel Admin",
            data: [280, 250, 325, 215, 250],
        },
        ],
        chart: {
        type: "bar",
        height: 275,
        toolbar: {
            show: false,
        },
        foreColor: "#adb0bb",
        fontFamily: "inherit",
        sparkline: {
            enabled: false,
        },
        },
        grid: {
        show: false,
        borderColor: "transparent",
        padding: {
            left: 0,
            right: 0,
            bottom: 0,
        },
        },
        plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: "25%",
            endingShape: "rounded",
            borderRadius: 5,
        },
        },
        colors: ["var(--bs-primary)", "var(--bs-secondary)"],
        dataLabels: {
        enabled: false,
        },
        yaxis: {
        show: true,
        min: 100,
        max: 400,
        tickAmount: 3,
        },
        stroke: {
        show: true,
        width: 5,
        lineCap: "butt",
        colors: ["transparent"],
        },
        xaxis: {
        type: "category",
        categories: ["鏡子", "磁鐵", "杯墊", "木板畫", "大畫"],
        axisBorder: {
            show: false,
        },
        },
        fill: {
        opacity: 1,
        },
        tooltip: {
        theme: "dark",
        },
        legend: {
        show: false,
        },
    };*/

(function($) {
    "use strict";

    /*var chart_column_basic = new ApexCharts(
        document.querySelector("#sales-overview"),
        options_sales_overview
    );
    chart_column_basic.render();*/

    /**
      * 檢查使用者是否登入
      */
    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
        console.log("目前登入的使用者:", user.email);
        } else {
        alert("尚未登入，請先登入！");
        window.location.href = "login.html";
        }
    }
    /**
      * 抓取supabase資料
      */
    async function fetchTableData(tableName, $table) {
        const { data, error } = await supabase
            .from(tableName)
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            console.error(`[${tableName}] 讀取資料失敗:`, error);
            return;
        }

        // 清空 tbody
        const $tbody = $table.find("tbody");
        $tbody.empty();

        data.forEach((row, i) => {
            const index = i + 1; // 從 1 開始計數
            const inputId = "picture__input_" + tableName + "_" + index;

            const img_base = "https://yvemaakibhtbtohrenjc.supabase.co/storage/v1/object/public/cloud/";
            const fileName = row.name ? row.name + '.png' : `${index}.png`;
            const filePath = `${tableName}/${fileName}`;
            const img_url = img_base + filePath;
            
            // 加上 bust query
            //var bust_url = img_url + "?t=" + Date.now();

            // 圖片欄位
            var img_box =   '<label class="picture" for="' + inputId + '" tabIndex="0">' +
                                '<span class="picture__image">' +
                                '<img src="' + img_url + '" class="picture__image" alt="' + row.name + '">' +
                                '</span>' +
                            '</label>' +
                            '<input type="file" class="picture__input" id="' + inputId + '" disabled>';

            // 操作按鈕
            const actions = '<a class="add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' + 
                            '<a class="edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' + 
                            '<a class="delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>';

            // 建立表格列
            const tr = `<tr data-file-path="${filePath}" data-image-url="${img_url}">
                <td>${index}</td>
                <td>${img_box}</td>
                <td>${row.feature}</td>
                <td>${row.price}</td>
                <td>${row.quantity}</td>
                <td><input type="checkbox" class="form-check-input text-center jarr" ${row.jarr ? "checked" : ""} disabled></td>
                <td><input type="checkbox" class="form-check-input text-center hot" ${row.hot ? "checked" : ""} disabled></td>
                <td>${actions}</td>
            </tr>`;
            $tbody.append(tr);
        });

        // 初始化 tooltip
        $('[data-toggle="tooltip"]').tooltip();

        // 更新分頁
        //getPagination($table.attr("id"));
        //$('#maxRows').trigger('change');
    }

    /**
      * 跳到最後一頁
      */
    function goLastPage(table) {
        var maxRows = parseInt($('#maxRows').val());   // 每頁顯示數量
        var totalRows = $('#' + table + ' tbody tr').length; // 總列數
        if (totalRows <= maxRows) return;  // 如果總列數不足一頁就不需要翻頁

        var lastPage = Math.ceil(totalRows / maxRows); // 最後一頁的頁碼
        var trIndex = 0;

        // 更新 pagination 樣式
        $('.pagination li').removeClass('active');
        $('.pagination li[data-page="' + lastPage + '"]').addClass('active');

        // 顯示最後一頁的資料
        $('#' + table + ' tr:gt(0)').each(function () {
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

    /**
      * 處理分頁
      */
    function getPagination (table){
        $('#maxRows').off('change').on('change', function(){
            $('.pagination').html('');						// reset pagination div
            var trnum = 0 ;									// reset tr counter 
            var maxRows = parseInt($(this).val());			// get Max Rows from select option

            var totalRows = $('#' + table+' tbody tr').length;		// numbers of rows
            $('#' + table + ' tr:gt(0)').each(function(){			// each TR in  table and not the header
                trnum++;									// Start Counter 
                if (trnum > maxRows ){						// if tr number gt maxRows
                    $(this).hide();							// fade it out 
                }
                if (trnum <= maxRows ){$(this).show();} // else fade in Important in case if it ..
            });											//  was fade out to fade it in 
            if (totalRows > maxRows){						// if tr total rows gt max rows option
                var pagenum = Math.ceil(totalRows/maxRows);	// ceil total(rows/maxrows) to get ..  
                                                            //	numbers of pages 
                for (var i = 1; i <= pagenum ;){			// for each page append pagination li 
                    $('.pagination').append('<li data-page="'+i+'"> <span>'+ i++ +'</span></li>').show();
                }											// end for i 
            } 												// end if row count > max rows
            $('.pagination li:first-child').addClass('active'); // add active class to the first li 
            
            //SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT
            showig_rows_count(maxRows, 1, totalRows);
            //SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT

            $('.pagination li').on('click',function(e){		// on click each page
                e.preventDefault();
                var pageNum = $(this).attr('data-page');	// get it's number
                var trIndex = 0 ;							// reset tr counter
                $('.pagination li').removeClass('active');	// remove active class from all li 
                $(this).addClass('active');					// add active class to the clicked 
            
                //SHOWING ROWS NUMBER OUT OF TOTAL
                showig_rows_count(maxRows, pageNum, totalRows);
                //SHOWING ROWS NUMBER OUT OF TOTAL
            
                $('#' + table+' tr:gt(0)').each(function(){		// each tr in table not the header
                    trIndex++;								// tr index counter 
                    // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
                    if (trIndex > (maxRows*pageNum) || trIndex <= ((maxRows*pageNum)-maxRows)){
                        $(this).hide();		
                    }else {$(this).show();} 				//else fade in 
                    }); 										// end of for each tr in table
            });										// end of on click pagination list
        }); // end of on select change 

    }   // END OF PAGINATION 

    /**
      * 顯示分頁筆數
      */
    function showig_rows_count(maxRows, pageNum, totalRows) {
    //Default rows showing
        var end_index = maxRows*pageNum;
        var start_index = ((maxRows*pageNum)- maxRows) + parseFloat(1);
        var string = 'Showing '+ start_index + ' to ' + end_index +' of ' + totalRows + ' entries';             
        $('.rows_count').html(string);
    }

    $(document).ready(function() {
        checkUser();

		const tabs = document.querySelectorAll("#productTabs .nav-link");
		const tables = document.querySelectorAll(".tab-content table");

		tabs.forEach(tab => {
			tab.addEventListener("click", function() {
				// 1. 移除 active 樣式
				tabs.forEach(t => t.classList.remove("active"));
				this.classList.add("active");

				// 2. 隱藏所有 table
				tables.forEach(table => table.classList.add("d-none"));

				// 3. 顯示目標 table
				currentTableId = this.getAttribute("data-target"); // ← 記住當前 table id
				document.getElementById(currentTableId).classList.remove("d-none");

				getPagination(currentTableId);
				$('#maxRows').trigger('change');
			});
		});

		getPagination(currentTableId);
		$('#maxRows').trigger('change');

		/**
		   * 下載所有table
		   */
		$(".tab-content table").each(async function () {
			const $table = $(this);
			const tableName = $table.attr("id").replace("Table", "");
			await fetchTableData(tableName, $table);

			getPagination(currentTableId);
			$('#maxRows').trigger('change');
		});
        /**
		   * 登出
		   */
        $(".logout-btn").click(async function(){
            const { error } = await supabase.auth.signOut();
            if (error) {
                alert("登出失敗: " + error.message);
            } else {
                alert("已登出");
                window.location.href = "login.html"; // 登出後跳回登入頁
            }
        });
		/**
		   * 增加表格col資料
		   */
		$(".add-new").click(function(){
			$('[data-toggle="tooltip"]').tooltip();
			
			var actions = '<a class="add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' + 
						  '<a class="edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' + 
						  '<a class="delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>'

			// 只計算當前 table 的行數
			var $tbody = $("#" + currentTableId + " tbody"); 
			var index = $tbody.find("tr").length + 1; 
			var inputId = "picture__input_" + currentTableId + "_" + index;

			var img_box = 
			  '<label class="picture" for="'+ inputId +'" tabIndex="0">' +
				'<span class="picture__image">Upload</span>' +
			  '</label>' +
			  '<input type="file" class="picture__input" id="'+ inputId +'">';

			$(this).attr("disabled", "disabled");
			
			var row = '<tr>' +
				'<td>' + index + '</td>' +
				'<td>' + img_box + '</td>' +
				'<td><input type="text" class="form-control text-center" name="feature" id="feature"></td>' +
				'<td><input type="text" class="form-control text-center" name="price" id="price"></td>' +
				'<td><input type="text" class="form-control text-center" name="quantity" id="quantity"></td>' +
                '<td><input type="checkbox" class="form-check-input text-center jarr" name="jarr" id="jarr"></td>' +
                '<td><input type="checkbox" class="form-check-input text-center hot" name="hot" id="hot"></td>' +
				'<td>' + actions + '</td>' +
			'</tr>';
			$tbody.append(row);		
			$tbody.find("tr:last-child").find(".add, .edit").toggle();
			$('[data-toggle="tooltip"]').tooltip();

			getPagination(currentTableId);
			$('#maxRows').trigger('change');
			goLastPage(currentTableId);
		});
		/**
		   * 確定增加表格col資料按鈕
		   */
		$(document).on("click", ".add", function(){
			var empty = false;
			var input = $(this).parents("tr").find('input[type="text"]');
			input.each(function(){
				if(!$(this).val()){
					$(this).addClass("error");
					empty = true;
				} else{
					$(this).removeClass("error");
				}
		});
        /**
		   * add按鈕按下後的執行動作
		   */
		$(this).parents("tr").find(".error").first().focus();
			if(!empty){
				input.each(function(){
					$(this).parent("td").html($(this).val());
				});	
				
				$(this).parents("tr").find(".add, .edit").toggle();
				$(this).parents("tr").find(".picture__input").attr("disabled", "disabled");
                $(this).parents("tr").find(".jarr").attr("disabled", "disabled");
                $(this).parents("tr").find(".hot").attr("disabled", "disabled");
				$(".add-new").removeAttr("disabled");
			}		
		});
		/**
		   * 表格編輯按鈕
		   */
		$(document).on("click", ".edit", function(){	
			$(this).parents("tr").find("td:not(:last-child):not(:eq(1),:eq(5),:eq(6))").each(function(){
				$(this).html('<input type="text" class="form-control text-center" value="' + $(this).text() + '">');
			});

			$(this).parents("tr").find(".add, .edit").toggle();
			$(this).parents("tr").find(".picture__input").removeAttr("disabled");
            $(this).parents("tr").find(".jarr").removeAttr("disabled");
            $(this).parents("tr").find(".hot").removeAttr("disabled");
			$(".add-new").attr("disabled", "disabled");
		});
		/**
		   * 表格刪除按鈕
		   */
		$(document).on("click", ".delete", function(){
			$(this).parents("tr").remove();
			$(".add-new").removeAttr("disabled");
            getPagination(currentTableId);
			$('#maxRows').trigger('change');
		});
		/**
		   * 上傳圖片按鈕
		   */
		$(document).on("change", ".picture__input", function(e){
			const $row = $(this).parents("tr"); // 找到目前這列
			const pictureImage = $row.find(".picture__image");
			const pictureImageTxt = "Upload";

			const inputTarget = e.target;
			const file = inputTarget.files[0];

			if (file) {
				const reader = new FileReader();

				reader.addEventListener("load", function (e) {
					const readerTarget = e.target;

					const img = $("<img>")
						.attr("src", readerTarget.result)
						.addClass("picture__img");

					pictureImage.html(""); // 清空內容
					pictureImage.append(img); // 插入圖片
				});

				reader.readAsDataURL(file);
			} else {
				pictureImage.html(pictureImageTxt);
			}
		});
		/**
		   * 同步supabase資料庫按鈕
		   */
		$(document).on("click", ".upload-btn", async function (e) {
			e.preventDefault();

            // 二次確認
            const ok = window.confirm(
                "將同步所有分頁的圖片與資料到雲端，確定要繼續嗎？"
            );
            if (!ok) return; // 取消就直接不做
            
            const $btn = $(this);
			$btn.prop("disabled", true).text("同步中...");

			try {
				const bucketName = "cloud";

				// 掃描所有 tab 下的 table
				$(".tab-content table").each(async function () {
					const $table = $(this);
					const tableId = $table.attr("id");      // e.g. mirrorTable
					const tableName = tableId.replace("Table", ""); // e.g. mirror
					const folder = folderMap[tableId] || tableName;

					const keepFiles = [];   // 需要保留的檔案 (表格有的)
					const uploadTasks = []; // 準備上傳的圖片
					const upsertTasks = []; // 準備 upsert 的表格資料

					// === 1️⃣ 掃描每一列 ===
					$table.find("tbody tr").each((rowIndex, tr) => {
						const $row = $(tr);
						const input = tr.querySelector(".picture__input");

						const id = rowIndex + 1;
						const name = $row.find("td:eq(0)").text().trim();
						const feature = $row.find("td:eq(2)").text().trim();
						var price = $row.find("td:eq(3)").text().trim();
						var quantity = $row.find("td:eq(4)").text().trim();
                        var jarr = $row.find("td:eq(5)").find("input[type=checkbox]").prop("checked");
                        var hot   = $row.find("td:eq(6)").find("input[type=checkbox]").prop("checked");

                        // 轉型處理：空字串 → null，有值 → number
                        price = price === "" ? null : parseInt(price, 10);
                        quantity = quantity === "" ? null : parseInt(quantity, 10);

						// 已存在的圖片
						const existingPath = $row.attr("data-file-path");
						if (existingPath) keepFiles.push(existingPath);

						// 如果使用者有選新圖
                        if (input && input.files && input.files.length > 0) {
                            const file = input.files[0];
                            const filePath = `${folder}/${name}.png`;
                            uploadTasks.push({ file, filePath, $row });
                            keepFiles.push(filePath);
                            $row.attr("data-file-path", filePath); // 更新 path
                        } else if (existingPath) {
                            // 使用者沒選新圖 → 保留原路徑
                            keepFiles.push(existingPath);
                        }

						// 收集表格的資料
						upsertTasks.push({ id, name, feature, price, quantity, jarr, hot });
					});

					// === 2️⃣ 刪除 Supabase Storage 多餘的檔案 ===
					const { data: listData, error: listError } = await supabase.storage.from(bucketName).list(folder);

                    if (!listError && listData) {
                        const deleteFiles = listData
                            .map(f => `${folder}/${f.name}`)
                            .filter(path => !keepFiles.includes(path) && !path.endsWith(".emptyFolderPlaceholder"));

                        if (deleteFiles.length > 0) {
                            const { error: delError } = await supabase.storage.from(bucketName).remove(deleteFiles);
                            if (delError) console.error(`[${folder}] 刪除失敗:`, delError);
                            else console.log(`[${folder}] 已刪除檔案:`, deleteFiles);
                        }
                    }

					// === 3️⃣ 上傳新圖片 ===
					for (const task of uploadTasks) {
                        // 先刪掉舊的，再上傳，保證更新
                        await supabase.storage.from(bucketName).remove([task.filePath]);

                        const { error } = await supabase.storage.from(bucketName).upload(
                            task.filePath,
                            task.file,
                            { upsert: true }
                        );

                        if (!error) {
                            const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(task.filePath);
                            //const bustUrl = `${urlData.publicUrl}?t=${Date.now()}`;

                            // 更新這一列的資料屬性 & 圖片 src
                            task.$row.attr("data-image-url", urlData.publicUrl);
                            task.$row.find("img.picture__image").attr("src", urlData.publicUrl);

                            // 鎖定 input
                            task.$row.find(".picture__input").prop("disabled", true);

                            console.log(`[${folder}] 圖片已上傳並更新顯示:`, task.filePath);
                        } else {
                            console.error(`[${folder}] 上傳失敗:`, task.filePath, error);
                        }
                    }

					// === 4️⃣ 同步資料庫 (刪除多餘 + upsert) ===
					const { data: serverRows, error: fetchError } = await supabase.from(tableName).select("id");
                    if (!fetchError && serverRows) {
                        const serverIds = serverRows.map(r => r.id);
                        const localIds = upsertTasks.map(r => r.id);
                        const deleteIds = serverIds.filter(id => !localIds.includes(id));
                        if (deleteIds.length > 0) {
                            const { error: delError } = await supabase.from(tableName).delete().in("id", deleteIds);
                            if (delError) console.error(`[${tableName}] 刪除失敗:`, delError);
                            else console.log(`[${tableName}] 已刪除多餘資料:`, deleteIds);
                        }
                    }

                    const { error: dbError } = await supabase.from(tableName).upsert(upsertTasks, { onConflict: ["id"] });
                    if (dbError) console.error(`[${tableName}] DB 更新失敗:`, dbError);
                    else console.log(`[${tableName}] DB 已同步`);
                });

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

/**
  * 快速搜尋
  */
function FilterkeyWord_all_table() {

    // Count td if you want to search on all table instead of specific column
    var currentTable = document.getElementById(currentTableId);

    var count = $(currentTable).find('tbody tr:first-child td').length; 

    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("search_input_all");
    var input_value = document.getElementById("search_input_all").value;
        filter = input.value.toLowerCase();
    if(input_value !=''){
        table = document.getElementById(currentTableId);
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 1; i < tr.length; i++) {
        
            var flag = 0;
            
            for(j = 0; j < count; j++){
                td = tr[i].getElementsByTagName("td")[j];
                if (td) {
                
                    var td_text = td.innerHTML;  
                    if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
                    //var td_text = td.innerHTML;  
                    //td.innerHTML = 'shaban';
                    flag = 1;
                    } else {
                    //DO NOTHING
                    }
                }
            }
            if(flag==1){
                tr[i].style.display = "";
            }else {
                tr[i].style.display = "none";
            }
        }
    }else {
    //RESET TABLE
    $('#maxRows').trigger('change');
    }
}