import {setCookie, loadCartFromCookie, renderCart, getCart, setCart} from './modules/cart.js';

(function($) {

  "use strict";

  const tables = ['mirror', 'magnet', 'coaster', 'wood', 'painting']; // 你有的 table 名稱
  const categoryMap_cn = {
      mirrors: '鏡子',
      magnets: '磁鐵',
      coasters: '杯墊',
      woods: '木板畫',
      paintings: '大畫'
  };

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

    var main_swiper = new Swiper('.main-carousel', {
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
        nextEl: '.main-carousel-next',
        prevEl: '.main-carousel-prev',
      }
    });

    var new_swiper = new Swiper('.new-swiper', {
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

    var hot_swiper = new Swiper('.hot-swiper', {
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

  /**
    * 建立訊息框架
    */
  async function renderNews() {
    const newsList = document.querySelector(".news-list");
    const news = await fetchTableData3("news");

    if (!news || news.length === 0) {
      newsList.innerHTML = `
        <li><div class="news-content" text-muted">暫無最新消息</div></li>
      `;
      reutrn;
    }

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
   * 建立商品框架
   */
  async function renderProducts(tag = "") {
    let wrapper;
    let products;

    if (tag === 'new') {
      wrapper = document.querySelector('.new-swiper .swiper-wrapper');
    } else if (tag === 'hot') {
      wrapper = document.querySelector('.hot-swiper .swiper-wrapper');
    }
    
    let allProducts = [];
    for (const t of tables) {
      const tmpProducts = await fetchTableData1(t, true);
      allProducts = allProducts.concat(tmpProducts);
    }
    if (tag === 'new') {
      products = allProducts.filter(p => p.jarr === true);
    } else if (tag === 'hot') {
      products = allProducts.filter(p => p.hot === true);
    }

    wrapper.innerHTML = "";

    products.forEach(p => {
      const slide = document.createElement('div');
      slide.className = 'product-item swiper-slide';
      
      const cate_cn = categoryMap_cn[p.category];
      slide.innerHTML = `
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
      `;

      wrapper.appendChild(slide);
    });

    // ✅ 事件委托：监听 wrapper 下所有 .add-to-cart 点击
    wrapper.addEventListener('click', function(e) {
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

  /**
   * 建立商品框架
   */
  async function renderProducts_mobile(tag = "") {
    let grid;
    let products;

    let allProducts = [];
    for (const t of tables) {
      const tmpProducts = await fetchTableData1(t, true);
      allProducts = allProducts.concat(tmpProducts);
    }
    if (tag === 'new') {
      products = allProducts.filter(p => p.jarr === true);
    } else if (tag === 'hot') {
      products = allProducts.filter(p => p.hot === true);
    }

    products.forEach(p => {
      if (tag === 'new') {
        grid = document.querySelector(`#nav-jarr .product-grid`);
      } else if (tag === 'hot') {
        grid = document.querySelector(`#nav-hot .product-grid`);
      }

      const cate_cn = categoryMap_cn[p.category];
      const col = document.createElement("div");
      col.style.padding = "0 6px";
      col.innerHTML = `
        <div class="product-item">
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

    grid.addEventListener('click', function(e) {
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

    });
  }

  // document ready
  $(document).ready(function() {
    let isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    initSwiper();
    //initChocolat();
    renderNews();
    if (isMobileDevice) {
      renderProducts_mobile('new');
      renderProducts_mobile('hot')
    } else {
      renderProducts('new');
      renderProducts('hot');
    }
  }); // End of a document

})(jQuery);