(function($) {

  "use strict";

  // init Chocolat light box
	var initChocolat = function() {
		Chocolat(document.querySelectorAll('.image-link'), {
		  imageSize: 'contain',
		  loop: true,
		})
	}

  var initSwiper = function() {

    var swiper = new Swiper(".main-swiper", {
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
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

  var initProducts = function() {
    // 當 index.html 載入時
    document.addEventListener("DOMContentLoaded", () => {
      const new_wrapper = document.querySelector(".new-products-carousel .swiper-wrapper");
      const popular_wrapper = document.querySelector(".popular-products-carousel .swiper-wrapper");

      if (new_wrapper) renderProducts(new_products, new_wrapper);
      if (popular_wrapper) renderProducts(popular_products, popular_wrapper);
    });
  }

  // document ready
  $(document).ready(function() {
    initSwiper();
    initChocolat();
    initProducts();
  }); // End of a document

})(jQuery);




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

// 通用函數：接收資料陣列 + wrapper
function renderProducts(products, wrapper) {
  products.forEach(p => {
    const slide = document.createElement("div");
    slide.className = "product-item swiper-slide";

    slide.innerHTML = `
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
    `;

    wrapper.appendChild(slide);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const new_wrapper = document.querySelector(".new-products-carousel .swiper-wrapper");
  const popular_wrapper = document.querySelector(".popular-products-carousel .swiper-wrapper");

  if (new_wrapper) renderProducts(new_products, new_wrapper);
  if (popular_wrapper) renderProducts(popular_products, popular_wrapper);
});