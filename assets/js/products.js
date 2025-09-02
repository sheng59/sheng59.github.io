const supabaseUrl = "https://yvemaakibhtbtohrenjc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZW1hYWtpYmh0YnRvaHJlbmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTg2NjMsImV4cCI6MjA3MTQzNDY2M30.gjCwUCG2onNhKjaHLPRrAz6NpWOq6TcdXsdcF3deYVY"; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

$(document).ready(function(){
  // 初始化
  loadAllProducts();
});

/**
   * 從 Supabase 取資料，並轉換成 products 陣列
   */
async function fetchTableData(tableName) {
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
      title: row.feature,
      qty: row.quantity,
      price: row.price,
      rating: 5,
      //image: bustUrl  // 用 bustUrl
      image: url
    };
  });

  return products;
}

/**
   * 載入所有表格資料
   */
async function loadAllProducts() {
  const tables = ["mirror", "magnet", "coaster", "wood", "painting"]; // 你有的 table 名稱

  let allProducts = [];
  for (const t of tables) {
    const products = await fetchTableData(t);
    allProducts = allProducts.concat(products);
  }

  // 清空舊的 DOM
  document.querySelectorAll(".product-grid").forEach(grid => grid.innerHTML = "");

  // 用你的 renderProducts 塞進去
  renderProducts(allProducts);
}

/**
   * 載入表格資料，動態建立商品
   */
function renderProducts(products) {
  products.forEach(p => {
    let gridId = `#nav-${p.category} .product-grid`;
    let grid = document.querySelector(gridId);
    let allGrid = document.querySelector("#nav-all .product-grid");

    const emptyBadge = p.qty === 0
      ? '<span class="badge bg-danger position-absolute m-3" style="font-size: 18px;">完售</span>'
      : '';

    const col = document.createElement("div");
    col.className = "col";
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
      </div>
    `;

    if (grid) grid.appendChild(col);
    if (allGrid) allGrid.appendChild(col.cloneNode(true));
  });
}