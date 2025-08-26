const new_products = [
  {
    title: "Sunstar Fresh Melon Juice",
    qty: "1 Unit",
    rating: 4.5,
    price: "$18.00",
    image: "assets/img/thumb-tomatoes.png"
  },
  {
    title: "Organic Bananas",
    qty: "1 Bunch",
    rating: 4.8,
    price: "$12.00",
    image: "assets/img/thumb-bananas.png"
  },
  {
    title: "Organic Bananas",
    qty: "1 Bunch",
    rating: 4.8,
    price: "$12.00",
    image: "assets/img/thumb-bananas.png"
  },
  {
    title: "Organic Bananas",
    qty: "1 Bunch",
    rating: 4.8,
    price: "$12.00",
    image: "assets/img/thumb-bananas.png"
  },
  {
    title: "Organic Bananas",
    qty: "1 Bunch",
    rating: 4.8,
    price: "$12.00",
    image: "assets/img/thumb-bananas.png"
  },
  {
    title: "Organic Bananas",
    qty: "1 Bunch",
    rating: 4.8,
    price: "$12.00",
    image: "assets/img/thumb-bananas.png"
  },
  {
    title: "Organic Bananas",
    qty: "1 Bunch",
    rating: 4.8,
    price: "$12.00",
    image: "assets/img/thumb-bananas.png"
  },
  {
    title: "Organic Bananas",
    qty: "1 Bunch",
    rating: 4.8,
    price: "$12.00",
    image: "assets/img/thumb-bananas.png"
  },
  {
    title: "Organic Bananas",
    qty: "1 Bunch",
    rating: 4.8,
    price: "$12.00",
    image: "assets/img/thumb-bananas.png"
  },
  {
    title: "Organic Bananas",
    qty: "1 Bunch",
    rating: 4.8,
    price: "$12.00",
    image: "assets/img/thumb-bananas.png"
  }
];

const popular_products = [
  {
    title: "Sunstar Fresh Melon Juice",
    qty: "1 Unit",
    rating: 4.5,
    price: "$18.00",
    image: "assets/img/thumb-tomatoes.png"
  },
  {
    title: "Organic Bananas",
    qty: "1 Bunch",
    rating: 4.8,
    price: "$12.00",
    image: "assets/img/thumb-bananas.png"
  },
  {
    title: "Sunstar Fresh Melon Juice",
    qty: "1 Unit",
    rating: 4.5,
    price: "$18.00",
    image: "assets/img/thumb-tomatoes.png"
  },
  {
    title: "Sunstar Fresh Melon Juice",
    qty: "1 Unit",
    rating: 4.5,
    price: "$18.00",
    image: "assets/img/thumb-tomatoes.png"
  },
  {
    title: "Sunstar Fresh Melon Juice",
    qty: "1 Unit",
    rating: 4.5,
    price: "$18.00",
    image: "assets/img/thumb-tomatoes.png"
  },
  {
    title: "Sunstar Fresh Melon Juice",
    qty: "1 Unit",
    rating: 4.5,
    price: "$18.00",
    image: "assets/img/thumb-tomatoes.png"
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
        <a href="index.html" title="${p.title}">
          <img src="${p.image}" class="tab-image">
        </a>
      </figure>
      <h3>${p.title}</h3>
      <span class="qty">${p.qty}</span>
      <span class="rating">
        <svg width="24" height="24" class="text-primary"><use xlink:href="#star-solid"></use></svg> 
        ${p.rating}
      </span>
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

// 當 index.html 載入時
document.addEventListener("DOMContentLoaded", () => {
  const new_wrapper = document.querySelector(".new-products-carousel .swiper-wrapper");
  const popular_wrapper = document.querySelector(".popular-products-carousel .swiper-wrapper");

  if (new_wrapper) renderProducts(new_products, new_wrapper);
  if (popular_wrapper) renderProducts(popular_products, popular_wrapper);
});

(function($) {

  "use strict";

  var initPreloader = function() {
    $(document).ready(function($) {
    var Body = $('body');
        Body.addClass('preloader-site');
    });
    $(window).load(function() {
        $('.preloader-wrapper').fadeOut();
        $('body').removeClass('preloader-site');
    });
  }

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

  var initProductQty = function(){

    $('.product-qty').each(function(){

      var $el_product = $(this);
      var quantity = 0;

      $el_product.find('.quantity-right-plus').click(function(e){
          e.preventDefault();
          var quantity = parseInt($el_product.find('#quantity').val());
          $el_product.find('#quantity').val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function(e){
          e.preventDefault();
          var quantity = parseInt($el_product.find('#quantity').val());
          if(quantity>0){
            $el_product.find('#quantity').val(quantity - 1);
          }
      });

    });

  }

  // init jarallax parallax
  var initJarallax = function() {
    jarallax(document.querySelectorAll(".jarallax"));

    jarallax(document.querySelectorAll(".jarallax-keep-img"), {
      keepImg: true,
    });
  }

  // document ready
  $(document).ready(function() {
    
    initPreloader();
    initSwiper();
    initProductQty();
    initJarallax();
    initChocolat();

  }); // End of a document

})(jQuery);