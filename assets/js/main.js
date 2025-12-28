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
      effect: 'creative',
      speed: 500,
      loop: true,
      autoplay:{
        delay:5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      slidesPerView: 1,
      grabCursor: true,
      creativeEffect: {
        prev: {
          shadow: true,
          translate: ["-20%", 0, -1],
        },
        next: {
          translate: ["100%", 0, 0],
          shadow: true,
        }
      },
      pagination: {
        el: '.main-carousel-pagination',
        type: 'bullets',
      },
      navigation: {
        nextEl: ".main-carousel-next",
        prevEl: ".main-carousel-prev",
      }
    });

    var new_swiper = new Swiper(".new-swiper", {
      slidesPerView: 5,
      spaceBetween: 30,
      speed: 500,
      scrollbar: {
        el: '.new-swiper-scrollbar',
        hide: false,
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

    var hot_swiper = new Swiper(".hot-swiper", {
      slidesPerView: 5,
      spaceBetween: 30,
      speed: 500,
      scrollbar: {
        el: '.hot-swiper-scrollbar',
        hide: false,
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
  }*/

  const categoryMap_cn = {
      mirrors: "鏡子",
      magnets: "磁鐵",
      coasters: "杯墊",
      woods: "木板畫",
      paintings: "大畫"
  };

  /**
   * 建立商品框架
   */
  function renderProducts_desktop(products, wrapper) {
    wrapper.innerHTML = "";

    products.forEach(p => {
      const slide = document.createElement("div");
      slide.className = "product-item swiper-slide";
      
      const cate_cn = categoryMap_cn[p.category];
      slide.innerHTML = `
        <a href="#" class="btn-wishlist">
          <svg width="24" height="24"><use xlink:href="#heart"></use></svg>
        </a>
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
          <a href="#" class="pe-2 nav-link align-self-end">
            <svg width="24" height="24"><use xlink:href="#add cart"></use></svg>
          </a>
        </div>
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

      const cate_cn = categoryMap_cn[p.category];
      const col = document.createElement("div");
      col.style.padding = "0 6px";
      col.innerHTML = `
        <div class="product-item">
          <a href="#" class="btn-wishlist">
            <svg width="24" height="24"><use xlink:href="#heart"></use></svg>
          </a>
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
            <a href="#" class="pe-2 nav-link align-self-end">
              <svg width="24" height="24"><use xlink:href="#add cart"></use></svg>
            </a>
          </div>
        </div>
      `;

      if (grid) grid.appendChild(col);
      if (allGrid) allGrid.appendChild(col.cloneNode(true));
    });
  }

  /**
    * 建立訊息框架
    */
  async function renderNews() {
    const newsList = document.querySelector(".news-list");
    const news = await fetchTableData3("news");
    console.log(news);
    newsList.innerHTML = ""; // 清空舊資料
    news.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="news-content">
          ${item.date} 【${item.title}】 ${item.content}
        </div>
      `;
      newsList.appendChild(li);
    });
  }

  /**
   * 建立所有商品
   */
  async function loadAllProducts() {
    const tables = ["mirror", "magnet", "coaster", "wood", "painting"]; // 你有的 table 名稱

    let allProducts = [];
    for (const t of tables) {
      const products = await fetchTableData1(t, true);
      allProducts = allProducts.concat(products);
    }

    // 依 checkbox 狀態分類
    const new_products = allProducts.filter(p => p.jarr === true);
    const hot_products = allProducts.filter(p => p.hot === true);

    var isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobileDevice) {
      // 清空舊的 DOM
      document.querySelectorAll(".product-grid").forEach(grid => grid.innerHTML = "");

      // 用你的 renderProducts 塞進去
      renderProducts_mobile(new_products, "#nav-jarr");
      renderProducts_mobile(hot_products, "#nav-hot");
    } else {
      // 找到前端容器
      const new_wrapper = document.querySelector(".new-swiper .swiper-wrapper");
      const hot_wrapper = document.querySelector(".hot-swiper .swiper-wrapper");

      if (new_wrapper) renderProducts_desktop(new_products, new_wrapper);
      if (hot_wrapper) renderProducts_desktop(hot_products, hot_wrapper);
    }
  }

  var initProductQty = function(){
    $(document).on('click', '.quantity-right-plus', function(e) {
      e.preventDefault();
      const $container = $(this).closest('.product-qty');
      const $input = $container.find('.quantity-input');
      let val = parseInt($input.val()) || 0;
      $input.val(val + 1);
    });

    $(document).on('click', '.quantity-left-minus', function(e) {
      e.preventDefault();
      const $container = $(this).closest('.product-qty');
      const $input = $container.find('.quantity-input');
      let val = parseInt($input.val()) || 0;
      if (val > 0) $input.val(val - 1);
    });

  }

  /**
   * 建立所有商品
   */
  var initProducts = function() {
    // 當 index.html 載入時
    const new_wrapper = document.querySelector(".new-swiper .swiper-wrapper");
    const hot_wrapper = document.querySelector(".hot-swiper .swiper-wrapper");

    if (new_wrapper) renderProducts(new_products, new_wrapper);
    if (hot_wrapper) renderProducts(hot_products, hot_wrapper);
  }

  // document ready
  $(document).ready(function() {
    initSwiper();
    initChocolat();
    //initProducts();
    renderNews();
    loadAllProducts();
  }); // End of a document

})(jQuery);