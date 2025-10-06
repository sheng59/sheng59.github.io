/**
   * supabase api全域變數
   */
const supabaseUrl = "https://yvemaakibhtbtohrenjc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZW1hYWtpYmh0YnRvaHJlbmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTg2NjMsImV4cCI6MjA3MTQzNDY2M30.gjCwUCG2onNhKjaHLPRrAz6NpWOq6TcdXsdcF3deYVY"; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

(function($) {

  "use strict";

  /**
   * 宣告Chocolat light box
   */
	var initChocolat = function() {
		Chocolat(document.querySelectorAll('.image-link'), {
		  imageSize: 'contain',
		  loop: true,
		})
	}
  /**
   * 宣告swiper
   */
  var initSwiper = function() {

    var main_swiper = new Swiper(".main-carousel", {
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 500,
      /*pagination: {
        el: '.main-pagination',
        type: 'bullets',
      },*/
      navigation: {
        nextEl: ".main-carousel-next",
        prevEl: ".main-carousel-prev",
      }
    });

    var new_products_swiper = new Swiper(".new-products-carousel", {
      slidesPerView: 5,
      spaceBetween: 30,
      speed: 500,
      pagination: {
        el: '.new-pagination',
        type: 'progressbar',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 4,
        },
        1500: {
          slidesPerView: 5,
        },
      }
    });

    var popular_products_swiper = new Swiper(".popular-products-carousel", {
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 500,
      pagination: {
        el: '.new-pagination',
        type: 'progressbar',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 4,
        },
        1500: {
          slidesPerView: 5,
        },
      }
    });
  }

  /**
   * 抓取supabase資料
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
      mirror: "鏡子",
      magnet: "磁鐵",
      coaster: "杯墊",
      wood: "木板畫",
      painting: "大畫"
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
        jarr: row.jarr,
        hot: row.hot,
        //image: bustUrl  // 用 bustUrl
        image: url
      };
    });

    return products;
  }

  /**
   * 建立商品框架
   */
  function renderProducts_desktop(products, wrapper) {
    wrapper.innerHTML = "";

    products.forEach(p => {
      const slide = document.createElement("div");
      slide.className = "product-item swiper-slide";

      slide.innerHTML = `
        <figure>
          <a href="index.html" title="${p.feature}">
            <img src="${p.image}" class="tab-image">
          </a>
        </figure>
        <div class="p-3">
          <span class="feature">${p.feature}樣式的${p.category}</span>
          <span class="price">$${p.price}</span>
        </div>
        <a href="#" class="btn-wishlist">
          <svg width="24" height="24"><use xlink:href="#heart"></use></svg>
        </a>
      `;

      wrapper.appendChild(slide);
    });
  }

  /**
   * 建立商品框架
   */
  function renderProducts_mobile(products, tname) {
    products.forEach(p => {
      let gridId = `#nav-${p.category} .product-grid`;
      let grid = document.querySelector(gridId);
      let allGrid = document.querySelector(`${tname} .product-grid`);

      const emptyBadge = p.qty === 0
        ? '<span class="badge bg-danger position-absolute m-3" style="font-size: 18px;">完售</span>'
        : '';

      const col = document.createElement("div");
      col.style.padding = "0 6px";
      col.innerHTML = `
        <div class="product-item">
          ${emptyBadge}
          <a href="#" class="btn-wishlist"><svg width="24" height="24"><use xlink:href="#heart"></use></svg></a>
          <figure>
            <a title="${p.feature}">
              <img src="${p.image}" class="tab-image">
            </a>
          </figure>
          <div class="ps-2 pb-2">
            <span class="feature">${p.feature}樣式的${p.category}</span>
            <span class="price">$${p.price}</span>
          </div>
          <a href="#" class="btn-wishlist">
            <svg width="20" height="20"><use xlink:href="#heart"></use></svg>
          </a>
        </div>
      `;

      if (grid) grid.appendChild(col);
      if (allGrid) allGrid.appendChild(col.cloneNode(true));
    });
  }

  /**
   * 建立所有商品
   */
  async function loadAllProducts() {
    const tables = ["mirror", "magnet", "coaster", "wood", "painting"]; // 你有的 table 名稱

    let allProducts = [];
    for (const t of tables) {
      const products = await fetchTableData(t);
      allProducts = allProducts.concat(products);
    }

    // 依 checkbox 狀態分類
    const new_products = allProducts.filter(p => p.jarr === true);
    const popular_products = allProducts.filter(p => p.hot === true);

    var isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobileDevice) {
      // 清空舊的 DOM
      document.querySelectorAll(".product-grid").forEach(grid => grid.innerHTML = "");

      // 用你的 renderProducts 塞進去
      renderProducts_mobile(new_products, "#nav-jarr");
      renderProducts_mobile(popular_products, "#nav-hot");
    } else {
      // 找到前端容器
      const new_wrapper = document.querySelector(".new-products-carousel .swiper-wrapper");
      const popular_wrapper = document.querySelector(".popular-products-carousel .swiper-wrapper");

      if (new_wrapper) renderProducts_desktop(new_products, new_wrapper);
      if (popular_wrapper) renderProducts_desktop(popular_products, popular_wrapper);
    }
  }

  /**
   * 建立所有商品
   */
  var initProducts = function() {
    // 當 index.html 載入時
    const new_wrapper = document.querySelector(".new-products-carousel .swiper-wrapper");
    const popular_wrapper = document.querySelector(".popular-products-carousel .swiper-wrapper");

    if (new_wrapper) renderProducts(new_products, new_wrapper);
    if (popular_wrapper) renderProducts(popular_products, popular_wrapper);
  }

  // document ready
  $(document).ready(function() {
    initSwiper();
    initChocolat();
    //initProducts();
    loadAllProducts();
  }); // End of a document

})(jQuery);