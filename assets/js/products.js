import {setCookie, loadCartFromCookie, renderCart, getCart, setCart} from './modules/cart.js';

(function($) {

  "use strict";

  /**
   * 抓取supabase資料
   */
  /*async function fetchTableData(tableName) {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(`[${tableName}] 讀取資料失敗:`, error);
      return [];
    }

    const img_base = "https://yvemaakibhtbtohrenjc.supabase.co/storage/v1/object/public/cloud/";

    // 表格名稱 → tab 對應 id
    const categoryMap = {
      mirror: "mirrors",
      magnet: "magnets",
      coaster: "coasters",
      wood: "woods",
      painting: "paintings"
    };

    // 把 DB row → 前台用的 product 格式
    
    const products = data.map(row => {
      // 原本圖片路徑
      const url = `${img_base}${tableName}/${row.name}.png`;

      // 加上時間戳，破快取
      //const bustUrl = `${url}?t=${Date.now()}`;

      return {
        id: row.id,
        category: categoryMap[tableName],   // tab 對應 id
        feature: row.feature,
        qty: row.quantity,
        price: row.price,
        rating: 5,
        //image: bustUrl  // 用 bustUrl
        image: url
      };
    });

    return products;
  }*/

  const tables = ["mirror", "magnet", "coaster", "wood", "painting"]; // 你有的 table 名稱
  const categoryMap_cn = {
      mirror: "鏡子",
      magnet: "磁鐵",
      coaster: "杯墊",
      wood: "木板畫",
      painting: "大畫"
  };

  /**
   * 建立所有商品
   */
  async function renderProducts(tname) {
    let grid;
    let products = [];

    for (const t of tables) {
      const tmpProducts = await fetchTableData1(t);
      products = products.concat(tmpProducts);
    }

    // 清空舊的 DOM
    document.querySelectorAll(".product-grid").forEach(grid => grid.innerHTML = "");

    products.forEach(p => {
      grid = document.querySelector(`#nav-${p.category} .product-grid`);
      console.log(p.category);
      var badge = '';
      
      if (p.qty === 0)
        badge = '<span class="badge bg-danger position-absolute m-2">0</span>';
      if (p.jarr === true)
        badge = '<span class="badge bg-danger position-absolute m-2">NEW</span>';
      if (p.hot === true)
        badge = '<span class="badge bg-danger position-absolute m-2">HOT</span>';
      if (p.jarr === true && p.hot === true)
        badge = '<span class="badge bg-danger position-absolute m-2">NEW</span>';

      const col = document.createElement("div");
      col.style.padding = "0 6px";
      col.className = "col";
      const cate_cn = categoryMap_cn[p.category];
      /*col.innerHTML = `
        <div class="product-item">
          ${emptyBadge}
          <a href="#" class="btn-wishlist"><svg width="24" height="24"><use xlink:href="#heart"></use></svg></a>
          <figure>
            <a title="${p.title}">
              <img src="${p.image}" class="tab-image">
            </a>
          </figure>
          <h3>${p.title}</h3>
          <span class="qty">${p.qty}</span>
          <span class="rating">
            <svg width="24" height="24" class="text-primary"><use xlink:href="#star-solid"></use></svg> 
            ${p.rating}
          </span>
          <span class="price">$${p.price}</span>
          <div class="d-flex align-items-center justify-content-between">
            <div class="input-group product-qty">
              <span class="input-group-btn">
                <button type="button" class="quantity-left-minus btn btn-danger btn-number" data-type="minus">
                  <svg width="16" height="16"><use xlink:href="#minus"></use></svg>
                </button>
              </span>
              <input type="text" name="quantity" class="form-control input-number" value="1">
              <span class="input-group-btn">
                <button type="button" class="quantity-right-plus btn btn-success btn-number" data-type="plus">
                  <svg width="16" height="16"><use xlink:href="#plus"></use></svg>
                </button>
              </span>
            </div>
            <a href="#" class="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart"></iconify-icon></a>
          </div>
        </div>
      `;*/
      col.innerHTML = `
        <div class="product-item">
          ${badge}
          <figure>
            <a href="index.html" title="${p.feature}">
              <img src="${p.image}" class="tab-image">
            </a>
          </figure>
          <div class="p-2 d-flex justify-content-between align-items-center">
            <div>
              <span class="feature">${p.feature}樣式${cate_cn}</span>
              <span class="price">$${p.price}</span>
            </div>
            <a class="pe-2 nav-link align-self-end add-to-cart" data-key="${p.category}-${p.id}" style="cursor: pointer;">
              <svg width="24" height="24"><use xlink:href="#add-cart"></use></svg>
            </a>
          </div>
        </div>
      `;

      grid.appendChild(col);
    });
  }

  function addToCart(product) {
    const cart = getCart();

    // 1️⃣ 檢查是否已存在（同 category + id）
    const item = cart.find(p =>
      p.category === product.category && p.id === product.id
    );

    if (!item) {
      cart.push({
        ...product,
        qty: 1
      });
    }
    console.log(cart);
    setCart(cart);
    renderCart();
  }

  // document ready
  $(document).ready(function() {
    /*renderProducts();

    $(document).on('click', '.add-to-cart', function(e) {
      const btn = e.target.closest('.add-to-cart');
      if (!btn) return;
      e.preventDefault();
      
      const key = btn.dataset.key;
      const [category, idStr] = key.split('-');
      const id = parseInt(idStr, 10);

      // 🔍 同時比對 category 和 id
      const product = products.find(p => 
        p.category === category && p.id === id
      );

      if (product) {
        console.log('✅ 精準找到：', product.feature, '（', product.category, '#', product.id, '）');
        addToCart(product);
      } else {
        console.error('❌ 未找到商品：', key);
      }
    });*/
  }); // End of a document

})(jQuery);