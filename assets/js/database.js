/******************** database.js ************************/													   
/**
   * supabase api全域變數
   */

const supabaseUrl = "https://yvemaakibhtbtohrenjc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZW1hYWtpYmh0YnRvaHJlbmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTg2NjMsImV4cCI6MjA3MTQzNDY2M30.gjCwUCG2onNhKjaHLPRrAz6NpWOq6TcdXsdcF3deYVY"; 
const mysupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const bucketName = "cloud";
const img_base = `${supabaseUrl}/storage/v1/object/public/cloud/`;

const folderMap = {
  mirrorTable:   "mirror",
  magnetTable:   "magnet",
  coasterTable:  "coaster",
  woodTable:     "wood",
  paintingTable: "painting"
};

/**
  * 檢查使用者是否登入
  */
async function checkUser() {
	const { data: { user } } = await mysupabase.auth.getUser();
	if (user) {
	    console.log("目前登入的使用者:", user.email);
	} else {
	    alert("尚未登入，請先登入！");
	    window.location.href = "login.html";
	}
}

/**
  * 登出使用者
  */

async function logoutUser() {
	const { error } = await mysupabase.auth.signOut();
	if (error) {
		alert("登出失敗: " + error.message);
	} else {
		alert("已登出");
		window.location.href = "login.html"; // 登出後跳回登入頁
	}
}

/**
  * 初始化登入功能
  */
function initLogin(formId = "loginForm") {
	document.addEventListener("DOMContentLoaded", () => {
		const form = document.getElementById(formId);
		if (!form) {
		  console.error(`找不到 #${formId} 元素`);
		  return;
		}

		form.addEventListener("submit", async (e) => {
		  e.preventDefault();

		  const email = document.getElementById("email").value.trim();
		  const password = document.getElementById("password").value.trim();

		  const { data, error } = await mysupabase.auth.signInWithPassword({
			email,
			password,
		  });

		  if (error) {
			alert("登入失敗：" + error.message);
			console.error("登入錯誤：", error);
			return;
		  }

		  alert("登入成功！");
		  console.log("Session:", data.session);
		  window.location.href = "backoffice.html";
		});
	});
}

/**
  * 抓取supabase資料 type1
  */
async function fetchTableData1(tableName, filter=false) {
	const { data, error } = await mysupabase
	  .from(tableName)
	  .select("*")
	  .order("id", { ascending: true });

	if (error) {
	  console.error(`[${tableName}] 讀取資料失敗:`, error);
	  return [];
	}

	// 把 DB row → 前台用的 product 格式

	const products = data.map((row) => {
		const url = `${img_base}${tableName}/${row.name}.png`;

		const product = {
		  id: row.id,
		  feature: row.feature,
		  qty: row.quantity,
		  price: row.price,
		  jarr: row.jarr,
		  hot: row.hot,
		  image: url,
		};
		product.category = tableName;

		// ✅ 若指定 filter 才加入 jarr、hot 屬性
		if (filter) {
		  product.jarr = row.jarr;
		  product.hot = row.hot;
		}

		return product;
	});

  return products;
}

/**
  * 抓取supabase資料 type2
  */

async function fetchTableData2(tableName, $table) {
	const { data, error } = await mysupabase
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
  * 抓取supabase資料 type3
  */
async function fetchTableData3(tableName) {
	const { data, error } = await mysupabase
	  .from(tableName)
	  .select("*")
	  .order("id", { ascending: true });

	if (error) {
	  console.error(`[${tableName}] 讀取資料失敗:`, error);
	  return [];
	}

	// 把 DB row → 前台用的 news 格式

	const news = data.map((row) => {
		return {
		  id: row.id,
		  date: row.date,
		  title: row.title,
		  content: row.content
		};
	});

  return news;
}

/**
  * 同步supabase資料庫按鈕
  */
  
async function syncDatabase(e) {
	e.preventDefault();

	// 二次確認
	const ok = window.confirm(
		"將同步所有分頁的圖片與資料到雲端，確定要繼續嗎？"
	);
	if (!ok) return; // 取消就直接不做
	
	const $btn = $(this);
	$btn.prop("disabled", true).text("同步中...");

	try {
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
			const { data: listData, error: listError } = await mysupabase.storage.from(bucketName).list(folder);

			if (!listError && listData) {
				const deleteFiles = listData
					.map(f => `${folder}/${f.name}`)
					.filter(path => !keepFiles.includes(path) && !path.endsWith(".emptyFolderPlaceholder"));

				if (deleteFiles.length > 0) {
					const { error: delError } = await mysupabase.storage.from(bucketName).remove(deleteFiles);
					if (delError) console.error(`[${folder}] 刪除失敗:`, delError);
					else console.log(`[${folder}] 已刪除檔案:`, deleteFiles);
				}
			}

			// === 3️⃣ 上傳新圖片 ===
			for (const task of uploadTasks) {
				// 先刪掉舊的，再上傳，保證更新
				await mysupabase.storage.from(bucketName).remove([task.filePath]);

				const { error } = await mysupabase.storage.from(bucketName).upload(
					task.filePath,
					task.file,
					{ upsert: true }
				);

				if (!error) {
					const { data: urlData } = mysupabase.storage.from(bucketName).getPublicUrl(task.filePath);
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
			const { data: serverRows, error: fetchError } = await mysupabase.from(tableName).select("id");
			if (!fetchError && serverRows) {
				const serverIds = serverRows.map(r => r.id);
				const localIds = upsertTasks.map(r => r.id);
				const deleteIds = serverIds.filter(id => !localIds.includes(id));
				if (deleteIds.length > 0) {
					const { error: delError } = await mysupabase.from(tableName).delete().in("id", deleteIds);
					if (delError) console.error(`[${tableName}] 刪除失敗:`, delError);
					else console.log(`[${tableName}] 已刪除多餘資料:`, deleteIds);
				}
			}

			const { error: dbError } = await mysupabase.from(tableName).upsert(upsertTasks, { onConflict: ["id"] });
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
}