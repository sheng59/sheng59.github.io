/**
   * supabase api全域變數
   */
const supabaseUrl = "https://yvemaakibhtbtohrenjc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZW1hYWtpYmh0YnRvaHJlbmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTg2NjMsImV4cCI6MjA3MTQzNDY2M30.gjCwUCG2onNhKjaHLPRrAz6NpWOq6TcdXsdcF3deYVY"; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


/**
   * 商品動態建立變數
   */

const new_products = [
  {
    feature: "鋼琴",
    type: "鏡子",
    price: "NT$130",
    image: "assets/img/1.png"
  },
  {
    feature: "畢卡索",
    type: "鏡子",
    price: "NT$130",
    image: "assets/img/2.png"
  },
  {
    feature: "花",
    type: "鏡子",
    price: "NT$12",
    image: "assets/img/3.png"
  },
  {
    feature: "花",
    type: "大畫",
    price: "NT$2000",
    image: "assets/img/4.png"
  },
  {
    feature: "花",
    type: "大畫",
    price: "NT$2000",
    image: "assets/img/5.png"
  },
  {
    feature: "夢境",
    type: "木板畫",
    price: "NT$600",
    image: "assets/img/6.png"
  }
];

const popular_products = [
  {
    feature: "鋼琴",
    type: "鏡子",
    price: "NT$130",
    image: "assets/img/1.png"
  },
  {
    feature: "畢卡索",
    type: "鏡子",
    price: "NT$130",
    image: "assets/img/2.png"
  },
  {
    feature: "花",
    type: "鏡子",
    price: "NT$12",
    image: "assets/img/3.png"
  },
  {
    feature: "花",
    type: "大畫",
    price: "NT$2000",
    image: "assets/img/4.png"
  },
  {
    feature: "花",
    type: "大畫",
    price: "NT$2000",
    image: "assets/img/5.png"
  },
  {
    feature: "夢境",
    type: "木板畫",
    price: "NT$600",
    image: "assets/img/6.png"
  }
];


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
      navigation: {
        nextEl: ".main-carousel-next",
        prevEl: ".main-carousel-prev",
      }
    });

    var new_products_swiper = new Swiper(".new-products-carousel", {
      slidesPerView: 5,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".new-products-carousel-next",
        prevEl: ".new-products-carousel-prev",
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
      slidesPerView: 5,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".popular-products-carousel-next",
        prevEl: ".popular-products-carousel-prev",
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
        month: row.month,
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
  function renderProducts(products, wrapper) {
    wrapper.innerHTML = "";

    products.forEach(p => {
      const slide = document.createElement("div");
      slide.className = "product-item swiper-slide";

      /*slide.innerHTML = `
        <a href="#" class="btn-wishlist">
          <svg width="24" height="24"><use xlink:href="#heart"></use></svg>
        </a>
        <figure>
          <a href="index.html" title="${p.feature}">
            <img src="${p.image}" class="tab-image">
          </a>
        </figure>
        <h3>${p.feature}</h3>
        <span class="type">${p.type}</span>
        <span class="price">${p.price}</span>
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
      `;*/
      /*slide.innerHTML = `
        <a href="#" class="btn-wishlist">
          <svg width="24" height="24"><use xlink:href="#heart"></use></svg>
        </a>
        <figure>
          <a href="index.html" title="${p.feature}">
            <img src="${p.image}" class="tab-image">
          </a>
        </figure>
        <h3>${p.feature}</h3>
        <span class="type">${p.category}</span>
        <span class="price">$${p.price}</span>
      `;*/
      slide.innerHTML = `
        <figure>
          <a href="index.html" title="${p.feature}">
            <img src="${p.image}" class="tab-image">
          </a>
        </figure>
        <div class="p-3">
          <span style="color: #222222;">${p.feature}樣式的${p.category}</span>
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
    const new_products = allProducts.filter(p => p.month === true);
    const popular_products = allProducts.filter(p => p.hot === true);

    // 找到前端容器
    const new_wrapper = document.querySelector(".new-products-carousel .swiper-wrapper");
    const popular_wrapper = document.querySelector(".popular-products-carousel .swiper-wrapper");

    if (new_wrapper) renderProducts(new_products, new_wrapper);
    if (popular_wrapper) renderProducts(popular_products, popular_wrapper);
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