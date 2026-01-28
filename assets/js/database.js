const supabaseUrl = "https://yvemaakibhtbtohrenjc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZW1hYWtpYmh0YnRvaHJlbmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTg2NjMsImV4cCI6MjA3MTQzNDY2M30.gjCwUCG2onNhKjaHLPRrAz6NpWOq6TcdXsdcF3deYVY"; 
const mysupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const img_url = `${supabaseUrl}/storage/v1/object/public/cloud/`;

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

var createProduct = async function() {
	productList = [];

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
			productList[t].push({
                ...product,
                category: t,
                productCode: generateProductCode(t, product.id)
            });
		});
	}
}

/**
  * 渲染新產品
  */
var renderNewProducts = function(device='desktop') {
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
							<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category}-${product.id}" data-code="${generateProductCode(product.category, product.id)}" style="cursor: pointer;">
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
								<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category}-${product.id}" data-code="${generateProductCode(product.category, product.id)}" style="cursor: pointer;">
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
var renderHotProducts = function(device='desktop') {
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
							<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category}-${product.id}" data-code="${generateProductCode(product.category, product.id)}" style="cursor: pointer;">
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
								<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category}-${product.id}" data-code="${generateProductCode(product.category, product.id)}" style="cursor: pointer;">
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
var renderAllProducts = function() {
	for (const t of tb_en) {
		productList[t]
			.forEach(product => {
			var badge = '';
      
			if (product.qty === 0)
				badge = '<span class="badge bg-danger position-absolute m-2">0</span>';
			if (product.jarr === true)
				badge = '<span class="badge bg-danger position-absolute m-2">NEW</span>';
			if (product.hot === true)
				badge = '<span class="badge bg-danger position-absolute m-2">HOT</span>';
			if (product.jarr === true && product.hot === true)
				badge = '<span class="badge bg-danger position-absolute m-2">NEW</span>';

			$(`#nav-${t} .product-grid`).append(`
				<div class="col">
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
							<a class="pe-2 nav-link align-self-end add-to-cart" data-key="${product.category}-${product.id}" data-code="${generateProductCode(product.category, product.id)}" style="cursor: pointer;">
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
var renderBackendProduct = async function() {
	for (const t of tb_en) {

		let { data, error } = await mysupabase
		.from(t)
		.select('*')
		.order("id", { ascending: true })

		if (error) {
			console.error(`[${t}] 讀取資料失敗:`, error);
			return;
		}

		// 清空 tbody
		const $tbody = $(`#${t} tbody`);
		$tbody.empty();

		data.forEach((row, i) => {
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
				<td>${row.quantity}</td>
				<td><input type="checkbox" class="form-check-input text-center jarr" ${row.jarr ? "checked" : ""} disabled></td>
				<td><input type="checkbox" class="form-check-input text-center hot" ${row.hot ? "checked" : ""} disabled></td>
				<td>${act_div}</td>
			</tr>`;
			$tbody.append(tr);
		});

		// 初始化 tooltip
		$('[data-toggle="tooltip"]').tooltip();
	}
}