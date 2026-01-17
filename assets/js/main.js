import {setCookie, loadCartFromCookie, renderCart, getCart, setCart} from './modules/cart.js';

(function($) {

  "use strict";

  const tables = ['mirror', 'magnet', 'coaster', 'wood', 'painting']; // 你有的 table 名稱
  const categoryMap_cn = {
      mirror: '鏡子',
      magnet: '磁鐵',
      coaster: '杯墊',
      wood: '木板畫',
      painting: '大畫'
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

  // document ready
  $(document).ready(function() {
    let isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    initSwiper();
    initChocolat();

    if (isMobileDevice) {
      $('.tab-content').show();
      $('.new-swiper').hide();
      $('.hot-swiper').hide();
    } else {
      $('.tab-content').hide();
      $('.new-swiper').show();
      $('.hot-swiper').show();
    }
  }); // End of a document

})(jQuery);