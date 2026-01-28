const supabaseUrl = "https://yvemaakibhtbtohrenjc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZW1hYWtpYmh0YnRvaHJlbmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTg2NjMsImV4cCI6MjA3MTQzNDY2M30.gjCwUCG2onNhKjaHLPRrAz6NpWOq6TcdXsdcF3deYVY"; 
const mysupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const bucketName = "cloud";
const img_url = `${supabaseUrl}/storage/v1/object/public/${bucketName}/`;

const tb_en = ['mirror', 'magnet', 'coaster', 'wood', 'painting'];

const tb_cn = {
	mirror: "鏡子",
	magnet: "磁鐵",
	coaster: "杯墊",
	wood: "木板畫",
	painting: "大畫"
};

const categoryPrefix = {
    'wood': 'W',
    'painting': 'P',
    'mirror': 'M',      // 可以繼續擴充
    'magnet': 'MG',     // 如果需要 2 個字母
    'coaster': 'C'
};

let productList = [];

function generateProductCode(category, id) {
	if (!category) {
		console.warn('⚠️ 商品類別未定義，使用預設前綴 "X"');
        return `X${String(id).padStart(4, '0')}`;
	}
	const prefix = categoryPrefix[category] || category.substring(0, 1).toUpperCase();
	const codeNumber = String(id).padStart(4, '0'); // 補零到 4 位數
	return `${prefix}${codeNumber}`;
}

/**
  * 檢查使用者是否登入
  */
const checkUser = async function() {
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

const logoutUser = async function() {
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
const initLogin = function(formId = "loginForm") {
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

const createProduct = async function() {
	productList = {};

	for (const t of tb_en) {
		let { data, error } = await mysupabase
		.from(t)
		.select('*')
		.order("id", { ascending: true })

		if (error) {
			console.error(`[${t}] 讀取資料失敗:`, error);
			continue;
		}
		
		if (!productList[t]) {
            productList[t] = [];
        }

		data.forEach(product => {
			const item = {
				...product,
				category: t,
				datacode: generateProductCode(t, product.id),
				stockQty: product.quantity,
			};
			delete item.quantity;

			productList[t].push(item);
		});
	}
}

/**
  * 渲染新產品
  */
const renderNewProducts = function(device='desktop') {
	if (device === 'desktop') {
		$('.new-swiper .swiper-wrapper').empty();
	}
	else if (device === 'mobile') {
		$('#nav-jarr .product-grid').empty();
	}

	for (const t of tb_en) {
		productList[t]
			.filter(p => p.jarr)
			.forEach(product => {
				if (device === 'desktop') {
					$('.new-swiper .swiper-wrapper').append(`
						<div class="product-item swiper-slide">
							<figure>
								<a title="${product.feature}樣式${tb_cn[product.category]}"><img src="${img_url}${product.category}/${product.name}.png" class="tab-image"></a>
							</figure>
							<div class="p-2 d-flex justify-content-between align-items-center">
								<div>
									<span class="feature">${product.feature}樣式${tb_cn[product.category]}</span>
									<span class="price">$${product.price}</span>
								</div>
								<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category}-${product.id}" data-code="${product.datacode}" style="cursor: pointer;">
									<svg width="24" height="24"><use xlink:href="#add-cart"></use></svg>
								</a>
							</div>
						</div>
					`);
				}
				else if (device === 'mobile') {
					$('#nav-jarr .product-grid').append(`
						<div class="col">
							<div class="product-item">
								<figure>
									<a title="${product.feature}樣式${tb_cn[product.category]}"><img src="${img_url}${product.category}/${product.name}.png" class="tab-image"></a>
								</figure>
								<div class="p-2 d-flex justify-content-between align-items-center">
									<div>
										<span class="feature">${product.feature}樣式${tb_cn[product.category]}</span>
										<span class="price">$${product.price}</span>
									</div>
									<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category}-${product.id}" data-code="${product.datacode}" style="cursor: pointer;">
										<svg width="24" height="24"><use xlink:href="#add-cart"></use></svg>
									</a>
								</div>
							</div>
						</div>
					`);
				}
		});
	}

	if (window.newSwiperInstance) {
		window.newSwiperInstance.update();
	}
}

/**
  * 渲染熱門產品
  */
const renderHotProducts = function(device='desktop') {
	if (device === 'desktop') {
		$('.hot-swiper .swiper-wrapper').empty();
	}
	else if (device === 'mobile') {
		$('#nav-hot .product-grid').empty();
	}

	for (const t of tb_en) {
		productList[t]
			.filter(p => p.hot)
			.forEach(product => {
			if (device === 'desktop') {
				$('.hot-swiper .swiper-wrapper').append(`
					<div class="product-item swiper-slide">
						<figure>
							<a title="${product.feature}樣式${tb_cn[product.category]}"><img src="${img_url}${product.category}/${product.name}.png" class="tab-image"></a>
						</figure>
						<div class="p-2 d-flex justify-content-between align-items-center">
							<div>
								<span class="feature">${product.feature}樣式${tb_cn[product.category]}</span>
								<span class="price">$${product.price}</span>
							</div>
							<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category}-${product.id}" data-code="${product.datacode}" style="cursor: pointer;">
								<svg width="24" height="24"><use xlink:href="#add-cart"></use></svg>
							</a>
						</div>
					</div>
				`);
			}
			else if (device === 'mobile') {
				$('#nav-hot .product-grid').append(`
					<div class="col">
						<div class="product-item">
							<figure>
								<a title="${product.feature}樣式${tb_cn[product.category]}"><img src="${img_url}${product.category}/${product.name}.png" class="tab-image"></a>
							</figure>
							<div class="p-2 d-flex justify-content-between align-items-center">
								<div>
									<span class="feature">${product.feature}樣式${tb_cn[product.category]}</span>
									<span class="price">$${product.price}</span>
								</div>
								<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category}-${product.id}" data-code="${product.datacode}" style="cursor: pointer;">
									<svg width="24" height="24"><use xlink:href="#add-cart"></use></svg>
								</a>
							</div>
						</div>
					</div>
				`);
			}
		});
	}

	if (window.newSwiperInstance) {
		window.newSwiperInstance.update();
	}
}

/**
  * 渲染所有產品
  */
const renderAllProducts = function() {
	for (const t of tb_en) {
		productList[t]
			.forEach(product => {
                var badge = '';

                if (product.quantity === 0)
                    badge = '<span class="badge bg-danger position-absolute m-2">0</span>';
                if (product.jarr === true)
                    badge = '<span class="badge bg-danger position-absolute m-2">NEW</span>';
                if (product.hot === true)
                    badge = '<span class="badge bg-danger position-absolute m-2">HOT</span>';
                if (product.jarr === true && product.hot === true)
                    badge = '<span class="badge bg-danger position-absolute m-2">NEW</span>';

                $(`#nav-${product.category} .product-grid`).append(`
                    <div class="col p-xl-3">
                        <div class="product-item">
                            ${badge}
                            <figure>
                                <a title="${product.feature}樣式${tb_cn[product.category]}"><img src="${img_url}${t}/${product.name}.png" class="tab-image"></a>
                            </figure>
                            <div class="p-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="feature">${product.feature}樣式${tb_cn[product.category]}</span>
                                    <span class="price">$${product.price}</span>
                                </div>
                                <a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category}-${product.id}" data-code="${product.datacode}" style="cursor: pointer;">
                                    <svg width="24" height="24"><use xlink:href="#add-cart"></use></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                `);
		});
	}
}

/**
  * 搜尋後渲染產品
  */
const renderSearchProducts = function(keyword) {
	$(`#nav-all .product-grid`).empty();

	const normalizedKeyword = keyword.trim().toLowerCase();

	for (const t of tb_en) {
		productList[t]
			.forEach(product => {
				if (normalizedKeyword && !product.feature.toLowerCase().includes(normalizedKeyword)) {
        			return; // 跳過不符合的商品
      			}

                var badge = '';
        
                if (product.quantity === 0)
                    badge = '<span class="badge bg-danger position-absolute m-2">0</span>';
                if (product.jarr === true)
                    badge = '<span class="badge bg-danger position-absolute m-2">NEW</span>';
                if (product.hot === true)
                    badge = '<span class="badge bg-danger position-absolute m-2">HOT</span>';
                if (product.jarr === true && product.hot === true)
                    badge = '<span class="badge bg-danger position-absolute m-2">NEW</span>';

                $(`#nav-all .product-grid`).append(`
                    <div class="col p-xl-3">
                        <div class="product-item">
                            ${badge}
                            <figure>
                                <a title="${product.feature}樣式${tb_cn[product.category]}"><img src="${img_url}${t}/${product.name}.png" class="tab-image"></a>
                            </figure>
                            <div class="p-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="feature">${product.feature}樣式${tb_cn[product.category]}</span>
                                    <span class="price">$${product.price}</span>
                                </div>
                                <a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category}-${product.id}" data-code="${product.datacode}" style="cursor: pointer;">
                                    <svg width="24" height="24"><use xlink:href="#add-cart"></use></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                `);
		});
	}
}

/**
  * 渲染後台管理
  */
const renderBackendProduct = function() {
	for (const t of tb_en) {

        // 清空 tbody
		const $tbody = $(`#${t} tbody`);
		$tbody.empty();

        productList[t]
			.forEach((row, i) => {
                const index = i + 1;
                const inputId = "picture-" + t + "-" + index;

                const fileName = row.name ? row.name + '.png' : `${index}.png`;
                const filePath = `${t}/${fileName}`;
                const url = img_url + filePath;

                // 圖片欄位
                var img_div =   '<label class="picture" for="' + inputId + '" tabIndex="0">' +
                                    '<span class="picture-image">' +
                                    '<img src="' + url + '" class="picture-image" alt="' + row.name + '">' +
                                    '</span>' +
                                '</label>' +
                                '<input type="file" class="picture-input" id="' + inputId + '" disabled>';

                // 操作按鈕
                const act_div = '<a class="add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' + 
                                '<a class="edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' + 
                                '<a class="delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>';

                // 建立表格列
                const tr = `<tr data-file-path="${filePath}" data-image-url="${url}">
                    <td>${index}</td>
                    <td>${img_div}</td>
                    <td>${row.feature}</td>
                    <td>${row.price}</td>
                    <td>${row.stockQty}</td>
                    <td><input type="checkbox" class="form-check-input text-center jarr" ${row.jarr ? "checked" : ""} disabled></td>
                    <td><input type="checkbox" class="form-check-input text-center hot" ${row.hot ? "checked" : ""} disabled></td>
                    <td>${act_div}</td>
                </tr>`;
                $tbody.append(tr);

                // 初始化 tooltip
                $('[data-toggle="tooltip"]').tooltip();
            });
	}
}
/**
  * 渲染結帳頁面商品
  */
const renderOrdertList = function(device = 'desktop', cart = []) {
	let total = 0;

	if (device === 'desktop') {
		let $tbody = $(`#table-desktop tbody`);
		$tbody.empty();

		if (cart.length === 0) {
			$tbody.append(`
				<tr>
					<td colspan="6" class="text-center text-muted py-4">
						尚未選購商品
					</td>
				</tr>
			`);
		} else {
			cart.forEach(c => {
				$tbody.append(`
					<tr>
						<td>
							<img src="${img_url}${c.category}/${c.name}.png" class="img-fluid" style="max-width: 150px; height: auto;">
						</td>
						<td>${c.feature}樣式${tb_cn[c.category]}</td>
						<td>$${c.price}</td>
						<td>
							<select class="form-select w-25 mx-auto select-quantity" data-key="${c.category}-${c.id}" data-code="${c.datacode}" style="min-width: 60px; background-color: transparent;">
								<option value="1" ${c.purchaseQty == 1 ? 'selected' : ''}>1</option>
								<option value="2" ${c.purchaseQty == 2 ? 'selected' : ''}>2</option>
								<option value="3" ${c.purchaseQty == 3 ? 'selected' : ''}>3</option>
							</select>
						</td>
						<td>$${c.price*c.purchaseQty}</td>
						<td>
							<span style="cursor: pointer;" class="delete-shop-item" data-key="${c.category}-${c.id}" data-code="${c.datacode}">
								<svg width="24" height="24" viewBox="0 0 24 24"><use xlink:href="#delete"></use>
								</svg>
							</span>
						</td>
					</tr>
				`);
				total += (c.price*c.purchaseQty);
			});
		}
	} else if (device === 'mobile') {
		let $tbody = $(`#table-mobile tbody`);
		$tbody.empty();

		if (cart.length === 0) {
			$tbody.append(`
				<tr>
					<td colspan="3" class="text-center text-muted py-4">
						尚未選購商品
					</td>
				</tr>
			`);
		} else {
			cart.forEach(c => {
				$tbody.append(`
					<tr>
						<td>
							<img src="${img_url}${c.category}/${c.name}.png" class="img-fluid" style="min-width: 80px; max-width: 150px; width: 100%;">
						</td>
						<td class="text-start align-top" style="white-space: nowrap;">${c.feature}樣式${tb_cn[c.category]}</td>
						<td>
							<div>
							<select class="form-select w-25 mx-auto select-quantity" data-key="${c.category}-${c.id}" data-code="${c.datacode}" style="min-width: 60px; background-color: transparent;">
								<option value="1" ${c.purchaseQty == 1 ? 'selected' : ''}>1</option>
								<option value="2" ${c.purchaseQty == 2 ? 'selected' : ''}>2</option>
								<option value="3" ${c.purchaseQty == 3 ? 'selected' : ''}>3</option>
							</select>
							</div>
							<div>$${c.price*c.purchaseQty}</div>
							<div>
							<span style="cursor: pointer;" class="delete-shop-item" data-key="${c.category}-${c.id}" data-code="${c.datacode}">
								<svg width="24" height="24" viewBox="0 0 24 24"><use xlink:href="#delete"></use>
								</svg>
							</span>
							</div>
						</td>
					</tr>
				`);
				total += (c.price*c.purchaseQty);
			});
		}
	}
	let totalAmount = $('#total-amount');
	totalAmount.text(`$${total}`);
}

const syncUpdateDatabase = function() {
	$(".tab-content table").each(async function () {
		const $table = $(this);
		const tableName = $table.attr('id').split('-')[0];
		const folder = $table.attr('id').split('-')[0];

		const keepFiles = [];
		const uploadTasks = [];
		const upsertTasks = [];

		$table.find("tbody tr").each((rowIndex, tr) => {
			const $row = $(tr);
			const input = tr.querySelector(".picture-input");

			const id = rowIndex + 1;
			const name = $row.find("td:eq(0)").text().trim();
			const feature = $row.find("td:eq(2)").text().trim();
			var price = $row.find("td:eq(3)").text().trim();
			var quantity = $row.find("td:eq(4)").text().trim();
			var jarr = $row.find("td:eq(5)").find("input[type=checkbox]").prop("checked");
			var hot   = $row.find("td:eq(6)").find("input[type=checkbox]").prop("checked");

			price = price === "" ? null : parseInt(price, 10);
			quantity = quantity === "" ? null : parseInt(quantity, 10);

			const existingPath = $row.attr("data-file-path");
			if (existingPath) keepFiles.push(existingPath);

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
				task.$row.find("img.picture-image").attr("src", urlData.publicUrl);

				// 鎖定 input
				task.$row.find(".picture-input").prop("disabled", true);

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
}

const getProductList = () => productList;

export {
	createProduct,
	renderNewProducts,
	renderHotProducts,
	renderAllProducts,
	renderSearchProducts,
	renderBackendProduct,
	renderOrdertList,
	syncUpdateDatabase,
	checkUser,
	logoutUser,
	initLogin,
	getProductList
};