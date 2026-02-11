const API_BASE_URL = 'https://nodejs-mocha-one.vercel.app';
//const API_BASE_URL = 'http://127.0.0.1:3000';

const supabaseUrl = "https://yvemaakibhtbtohrenjc.supabase.co";
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
let paymentAmt = 0;

function generateProductCode(category, id) {
	if (!category) {
		console.warn('⚠️ 商品類別未定義，使用預設前綴 "X"');
        return `X${String(id).padStart(4, '0')}`;
	}
	const prefix = categoryPrefix[category] || category.substring(0, 1).toUpperCase();
	const codeNumber = String(id).padStart(4, '0'); // 補零到 4 位數
	return `${prefix}${codeNumber}`;
}

const saveToken = (token) => {
    localStorage.setItem('auth_token', token);
};

const getToken = () => {
    return localStorage.getItem('auth_token');
};

const clearToken = () => {
    localStorage.removeItem('auth_token');
};

/**
  * 檢查使用者是否登入
  */
const checkUser = async function() {
	try {
        const token = getToken();
        
        if (!token) {
            alert("尚未登入，請先登入！");
            window.location.href = "login.html";
            return false;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();

		console.log(result);
        
        if (result.logged_in) {
            console.log("目前登入的使用者:", result.data?.email);
            return true;
        } else {
            clearToken();
            alert("登入狀態已過期，請重新登入！");
            window.location.href = "login.html";
            return false;
        }
        
    } catch (error) {
        console.error('檢查登入狀態失敗:', error);
        clearToken();
        alert("登入狀態檢查失敗，請重新登入！");
        window.location.href = "login.html";
        return false;
    }
}

/**
  * 登出使用者
  */

const logoutUser = async function() {
	try {
        const token = getToken();
        
        if (!token) {
            alert("尚未登入");
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            clearToken();
            alert("已登出");
            window.location.href = "login.html";
        } else {
            alert("登出失敗: " + result.error);
        }
        
    } catch (error) {
        console.error('登出失敗:', error);
        alert("登出失敗: " + error.message);
    }
}

/**
  * 初始化登入功能
  */
const initLogin = function(formId = "loginForm") {
    document.addEventListener("DOMContentLoaded", async () => {
        
        // ✅ 檢查是否已登入
        const token = getToken();
        if (token) {
            console.log('🔄 檢測到登入狀態，正在驗證...');
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const result = await response.json();
                
                if (result.logged_in) {
                    // ✅ 已登入，直接跳轉
                    console.log('✅ 您已登入，正在跳轉至後台...');
                    alert('您已登入，正在跳轉至後台...');
                    window.location.href = "backoffice.html";
                    return; // 阻止後續代碼執行
                } else {
                    // Token 無效，清除並繼續顯示登入頁
                    clearToken();
                    console.log('⚠️ Token 無效，請重新登入');
                }
            } catch (error) {
                console.error('❌ 驗證登入狀態失敗:', error);
                clearToken();
            }
        }
        
        // 👇 以下為原有的登入表單邏輯
        const form = document.getElementById(formId);
        if (!form) {
            console.error(`找不到 #${formId} 元素`);
            return;
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!email || !password) {
                alert("請輸入電子郵件和密碼");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (!response.ok) {
                    alert("登入失敗：" + result.error);
                    console.error("登入錯誤：", result);
                    return;
                }

                // 儲存 token
                saveToken(result.session.access_token);
                
                alert("登入成功！");
                console.log("使用者:", result.user);
                window.location.href = "backoffice.html";
                
            } catch (error) {
                console.error('登入請求失敗:', error);
                alert("登入失敗: " + error.message);
            }
        });
    });
}

const createProduct = async function() {
	try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || '取得商品失敗');
        }
        
        // 轉換後端資料格式為前端需要的格式
        productList = {};
        for (const [category, products] of Object.entries(result.allProducts)) {
            if (!productList[category]) {
                productList[category] = [];
            }
            
            products.forEach(product => {
                const item = {
                    ...product,
                    category_cn: tb_cn[category] || category,
                    category_en: category,
                    datacode: generateProductCode(category, product.id),
                    stockQty: product.quantity || 0
                };
				delete item.quantity;

                productList[category].push(item);
            });
        }
        
        console.log('✅ 商品資料加載完成', productList);
        return true;
        
    } catch (error) {
        console.error('❌ 取得商品失敗:', error);
        alert(`載入商品失敗: ${error.message}`);
        return false;
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
								<a title="${product.feature}樣式${product.category_cn}"><img src="${img_url}${product.category_en}/${product.name}.png" class="tab-image"></a>
							</figure>
							<div class="p-2 d-flex justify-content-between align-items-center">
								<div>
									<span class="feature">${product.feature}樣式${product.category_cn}</span>
									<span class="price">$${product.price}</span>
								</div>
								<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category_en}-${product.id}" data-code="${product.datacode}" style="cursor: pointer;">
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
									<a title="${product.feature}樣式${product.category_cn}"><img src="${img_url}${product.category_en}/${product.name}.png" class="tab-image"></a>
								</figure>
								<div class="p-2 d-flex justify-content-between align-items-center">
									<div>
										<span class="feature">${product.feature}樣式${product.category_cn}</span>
										<span class="price">$${product.price}</span>
									</div>
									<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category_en}-${product.id}" data-code="${product.datacode}" style="cursor: pointer;">
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
							<a title="${product.feature}樣式${product.category_cn}"><img src="${img_url}${product.category_en}/${product.name}.png" class="tab-image"></a>
						</figure>
						<div class="p-2 d-flex justify-content-between align-items-center">
							<div>
								<span class="feature">${product.feature}樣式${product.category_cn}</span>
								<span class="price">$${product.price}</span>
							</div>
							<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category_en}-${product.id}" data-code="${product.datacode}" style="cursor: pointer;">
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
								<a title="${product.feature}樣式${product.category_cn}"><img src="${img_url}${product.category_en}/${product.name}.png" class="tab-image"></a>
							</figure>
							<div class="p-2 d-flex justify-content-between align-items-center">
								<div>
									<span class="feature">${product.feature}樣式${product.category_cn}</span>
									<span class="price">$${product.price}</span>
								</div>
								<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category_en}-${product.id}" data-code="${product.datacode}" style="cursor: pointer;">
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

                if (product.stockQty === 0)
                    badge = '<span class="badge bg-danger position-absolute m-2">0</span>';
                if (product.jarr === true)
                    badge = '<span class="badge bg-danger position-absolute m-2">NEW</span>';
                if (product.hot === true)
                    badge = '<span class="badge bg-danger position-absolute m-2">HOT</span>';
                if (product.jarr === true && product.hot === true)
                    badge = '<span class="badge bg-danger position-absolute m-2">NEW</span>';

                $(`#nav-${product.category_en} .product-grid`).append(`
                    <div class="col p-xl-3">
                        <div class="product-item">
                            ${badge}
                            <figure>
                                <a title="${product.feature}樣式${product.category_cn}"><img src="${img_url}${product.category_en}/${product.name}.png" class="tab-image"></a>
                            </figure>
                            <div class="p-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="feature">${product.feature}樣式${product.category_cn}</span>
                                    <span class="price">$${product.price}</span>
                                </div>
                                <a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category_en}-${product.id}" data-code="${product.datacode}" style="cursor: pointer;">
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
        
                if (product.stockQty === 0)
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
                                <a title="${product.feature}樣式${product.category_cn}"><img src="${img_url}${product.category_en}/${product.name}.png" class="tab-image"></a>
                            </figure>
                            <div class="p-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="feature">${product.feature}樣式${product.category_cn}</span>
                                    <span class="price">$${product.price}</span>
                                </div>
                                <a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category_en}-${product.id}" data-code="${product.datacode}" style="cursor: pointer;">
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
                const act_div =  	'<a class="add" data-toggle="tooltip"><svg width="28" height="28" viewBox="0 0 28 28"><use xlink:href="#add"></use></svg></a>' + 
                            	 	'<a class="edit" data-toggle="tooltip"><svg width="28" height="28" viewBox="0 0 28 28"><use xlink:href="#edit"></use></svg></a>' + 
                            		'<a class="delete" data-toggle="tooltip"><svg width="28" height="28" viewBox="0 0 28 28"><use xlink:href="#delete"></use></svg></a>';

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
				console.log(c);
				$tbody.append(`
					<tr>
						<td>
							<img src="${img_url}${c.category_en}/${c.name}.png" class="img-fluid" style="max-width: 150px; height: auto;">
						</td>
						<td>${c.feature}樣式${c.category_cn}</td>
						<td>$${c.price}</td>
						<td>
							<select class="form-select w-25 mx-auto select-quantity" data-key="${c.category_en}-${c.id}" data-code="${c.datacode}" style="min-width: 60px; background-color: transparent;">
								<option value="1" ${c.purchaseQty == 1 ? 'selected' : ''}>1</option>
								<option value="2" ${c.purchaseQty == 2 ? 'selected' : ''}>2</option>
								<option value="3" ${c.purchaseQty == 3 ? 'selected' : ''}>3</option>
							</select>
						</td>
						<td>$${c.price*c.purchaseQty}</td>
						<td>
							<span style="cursor: pointer;" class="delete-shop-item" data-key="${c.category_en}-${c.id}" data-code="${c.datacode}">
								<svg width="24" height="24" viewBox="0 0 24 24"><use xlink:href="#delete"></use>
								</svg>
							</span>
						</td>
					</tr>
				`);
				paymentAmt += (c.price*c.purchaseQty);
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
							<img src="${img_url}${c.category_en}/${c.name}.png" class="img-fluid" style="min-width: 100px; max-width: 150px; width: 100%;">
						</td>
						<td class="text-start align-top">${c.feature}樣式${c.category_cn}</td>
						<td>
							<div>
							<select class="form-select w-25 mx-auto select-quantity" data-key="${c.category_en}-${c.id}" data-code="${c.datacode}" style="min-width: 60px; background-color: transparent;">
								<option value="1" ${c.purchaseQty == 1 ? 'selected' : ''}>1</option>
								<option value="2" ${c.purchaseQty == 2 ? 'selected' : ''}>2</option>
								<option value="3" ${c.purchaseQty == 3 ? 'selected' : ''}>3</option>
							</select>
							</div>
							<div>$${c.price*c.purchaseQty}</div>
							<div>
							<span style="cursor: pointer;" class="delete-shop-item" data-key="${c.category_en}-${c.id}" data-code="${c.datacode}">
								<svg width="24" height="24" viewBox="0 0 24 24"><use xlink:href="#delete"></use>
								</svg>
							</span>
							</div>
						</td>
					</tr>
				`);
				paymentAmt += (c.price*c.purchaseQty);
			});
		}
	}
	let totalAmount = $('#total-amount');
	totalAmount.text(`$${paymentAmt}`);
	setPaymentAmt(paymentAmt);
}

const renderPayList = function(cart = []) {
	const $tbody = $('#payinfo-table tbody');

	cart.forEach(c => {
		$tbody.append(`
			<tr>
				<td class="text-start">${c.feature}樣式${c.category_cn}</td>
				<td>$${c.price}</td>
				<td>${c.purchaseQty}</td>
				<td>$${c.price * c.purchaseQty}</td>
			</tr>
		`);
	});

	const totalAmount = parseFloat(sessionStorage.getItem('orderTotal')) || 0;
	
	$tbody.append(`
		<tr>
			<td colspan="4" class="text-end border-bottom-0">
				<span class="fs-4 fw-bold text-dark">合計</span>
				<span class="fs-4 fw-bold text-dark" id="pay-amount">$${totalAmount}</span>
			</td>
		</tr>
	`);
}

const createOrder = async function(orderData, orderItems, orderMessage) {
	try {
        // 準備後端需要的格式
        const payload = {
            orderData: orderData,
            orderItems: orderItems,
			orderMessage: orderMessage
        };

		console.log(payload);

        // 呼叫後端 API
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || result.details || '建立訂單失敗');
        }
        
        console.log('✅ 訂單建立成功', result);
        return result;
        
    } catch (error) {
        console.error('❌ 建立訂單失敗:', error);
        alert(`建立訂單失敗: ${error.message}`);
        throw error;
    }
}

const renderOrder = async function() {
	const $tbody = $('#order-table tbody');
	$tbody.empty();

	let { data, error } = await mysupabase
		.from('orders')
		.select('*')
		//.order("id", { ascending: true })

	data.forEach(row => {
		let os_div, pm_div, ps_div;

		let act_div =   '<a class="add" data-toggle="tooltip"><svg width="28" height="28" viewBox="0 0 28 28"><use xlink:href="#add"></use></svg></a>' + 
						'<a class="edit" data-toggle="tooltip"><svg width="28" height="28" viewBox="0 0 28 28"><use xlink:href="#edit"></use></svg></a>' + 
						'<a class="delete" data-toggle="tooltip"><svg width="28" height="28" viewBox="0 0 28 28"><use xlink:href="#delete"></use></svg></a>';

		if (row.order_status === 'pending')
			os_div = '<div class="order-div enable">下單</div>';
		else if (row.order_status === 'cancelled')
			os_div = '<div class="order-div disbale">棄單</div>';

		if (row.payment_method === 'Line Pay')
			pm_div = '<div class="order-div enable">Line Pay</div>';

		if (row.payment_status === 'unpaid')
			ps_div = '<div class="order-div enable">未付款</div>';


		$tbody.append(`
			<tr>
				<td>${row.order_number}</td>
				<td>${row.order_date}</td>
				<td class="text-start align-top">
					<div>${row.buyer_name}</div>
					<div>${row.buyer_email}</div>
					<div>${row.buyer_phone}</div>
				</td>
				<td class="text-start align-top">
					<div>${row.recipient_name}</div>
					<div>${row.recipient_email}</div>
					<div>${row.recipient_phone}</div>
					<div>${row.recipient_address}</div>
				</td>
				<td>${os_div}</td>
				<td>${pm_div}</td>
				<td>${ps_div}</td>
				<td>${row.total_amount}</td>
				<td>${row.shipping_fee}</td>
				<td>${row.discount_amount}</td>
				<td>${row.notes}</td>
				<td>${row.created_at}</td>
				<td>${row.updated_at}</td>
				<td>
					${act_div}
				</td>
			</tr>
		`);
	});
}

const syncUpdateDatabase = async function() {
	try {
        // 1. 收集所有表格資料
        const tablesData = [];
        
        $(".tab-content table").each(function() {
            const $table = $(this);
            const tableName = $table.attr('id').split('-')[0];
            const folder = tableName;
            
            const rows = [];
            
            $table.find("tbody tr").each((rowIndex, tr) => {
                const $row = $(tr);
                const id = rowIndex + 1;
                const name = $row.find("td:eq(0)").text().trim();
                const feature = $row.find("td:eq(2)").text().trim();
                const price = $row.find("td:eq(3)").text().trim();
                const quantity = $row.find("td:eq(4)").text().trim();
                const jarr = $row.find("td:eq(5) input[type=checkbox]").prop("checked");
                const hot = $row.find("td:eq(6) input[type=checkbox]").prop("checked");
                
                rows.push({
                    id: id,
                    name: name,
                    feature: feature,
                    price: price === "" ? null : parseInt(price, 10),
                    quantity: quantity === "" ? null : parseInt(quantity, 10),
                    jarr: jarr,
                    hot: hot
                });
            });
            
            tablesData.push({
                tableName: tableName,
                folder: folder,
                rows: rows
            });
        });
        
        // 2. 發送到後端同步
        const response = await fetch(`${API_BASE_URL}/api/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tables: tablesData })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert("✅ 資料庫同步成功！");
            console.log("同步結果:", result.results);
        } else {
            const errors = result.results.filter(r => !r.success);
            alert(`⚠️ 部分同步失敗:\n${errors.map(e => `${e.table}: ${e.error}`).join('\n')}`);
            console.error("同步錯誤:", errors);
        }
        
        return result;
        
    } catch (error) {
        console.error('同步失敗:', error);
        alert("同步失敗: " + error.message);
        throw error;
    }
}

const getProductList = () => productList;
const getPaymentAmt = () => paymentAmt;

const setPaymentAmt = (newAmt) => {
	paymentAmt = newAmt;
	sessionStorage.setItem('orderTotal', newAmt.toString());
}

export {
	createProduct,
	renderNewProducts,
	renderHotProducts,
	renderAllProducts,
	renderSearchProducts,
	renderBackendProduct,
	renderOrdertList,
	renderPayList,
	syncUpdateDatabase,
	checkUser,
	logoutUser,
	initLogin,
	getProductList,
	createOrder,
	renderOrder,
	getPaymentAmt, 
	setPaymentAmt
};