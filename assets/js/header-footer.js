import {setCookie, loadCartFromCookie, renderCart, getCart, setCart} from './modules/cart.js';
import {createProduct, renderNewProducts, renderHotProducts, renderAllProducts, getProductList, renderBackendProduct} from './modules/product.js';

(function($) {

    "use strict";
    /**
      * 網頁loading
      */
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
    /**
      * header, footer動態建立
      */
    var initLayout = function() {
        var header =  `
            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                <defs>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="link" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 19a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm5 0a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm0-4a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm-5 0a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm7-12h-1V2a1 1 0 0 0-2 0v1H8V2a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3Zm1 17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9h16Zm0-11H4V6a1 1 0 0 1 1-1h1v1a1 1 0 0 0 2 0V5h8v1a1 1 0 0 0 2 0V5h1a1 1 0 0 1 1 1ZM7 15a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm0 4a1 1 0 1 0-1-1a1 1 0 0 0 1 1Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="arrow-right" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M17.92 11.62a1 1 0 0 0-.21-.33l-5-5a1 1 0 0 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 .21-.33a1 1 0 0 0 0-.76Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="category" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 5.5h-6.28l-.32-1a3 3 0 0 0-2.84-2H5a3 3 0 0 0-3 3v13a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-10a3 3 0 0 0-3-3Zm1 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1h4.56a1 1 0 0 1 .95.68l.54 1.64a1 1 0 0 0 .95.68h7a1 1 0 0 1 1 1Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="calendar" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 4h-2V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7h16Zm0-9H4V7a1 1 0 0 1 1-1h2v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h2a1 1 0 0 1 1 1Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="heart" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20.16 4.61A6.27 6.27 0 0 0 12 4a6.27 6.27 0 0 0-8.16 9.48l7.45 7.45a1 1 0 0 0 1.42 0l7.45-7.45a6.27 6.27 0 0 0 0-8.87Zm-1.41 7.46L12 18.81l-6.75-6.74a4.28 4.28 0 0 1 3-7.3a4.25 4.25 0 0 1 3 1.25a1 1 0 0 0 1.42 0a4.27 4.27 0 0 1 6 6.05Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="plus" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="minus" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 11H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="cart" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8.5 19a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 8.5 19ZM19 16H7a1 1 0 0 1 0-2h8.491a3.013 3.013 0 0 0 2.885-2.176l1.585-5.55A1 1 0 0 0 19 5H6.74a3.007 3.007 0 0 0-2.82-2H3a1 1 0 0 0 0 2h.921a1.005 1.005 0 0 1 .962.725l.155.545v.005l1.641 5.742A3 3 0 0 0 7 18h12a1 1 0 0 0 0-2Zm-1.326-9l-1.22 4.274a1.005 1.005 0 0 1-.963.726H8.754l-.255-.892L7.326 7ZM16.5 19a1.5 1.5 0 1 0 1.5 1.5a1.5 1.5 0 0 0-1.5-1.5Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="check" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M18.71 7.21a1 1 0 0 0-1.42 0l-7.45 7.46l-3.13-3.14A1 1 0 1 0 5.29 13l3.84 3.84a1 1 0 0 0 1.42 0l8.16-8.16a1 1 0 0 0 0-1.47Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="trash" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M10 18a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1ZM20 6h-4V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2ZM10 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm7 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8h10Zm-3-1a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="star-outline" viewBox="0 0 15 15">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M7.5 9.804L5.337 11l.413-2.533L4 6.674l2.418-.37L7.5 4l1.082 2.304l2.418.37l-1.75 1.793L9.663 11L7.5 9.804Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="star-solid" viewBox="0 0 15 15">
                    <path fill="currentColor" d="M7.953 3.788a.5.5 0 0 0-.906 0L6.08 5.85l-2.154.33a.5.5 0 0 0-.283.843l1.574 1.613l-.373 2.284a.5.5 0 0 0 .736.518l1.92-1.063l1.921 1.063a.5.5 0 0 0 .736-.519l-.373-2.283l1.574-1.613a.5.5 0 0 0-.283-.844L8.921 5.85l-.968-2.062Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="search" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="user" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M15.71 12.71a6 6 0 1 0-7.42 0a10 10 0 0 0-6.22 8.18a1 1 0 0 0 2 .22a8 8 0 0 1 15.9 0a1 1 0 0 0 1 .89h.11a1 1 0 0 0 .88-1.1a10 10 0 0 0-6.25-8.19ZM12 12a4 4 0 1 1 4-4a4 4 0 0 1-4 4Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="close" viewBox="0 0 15 15">
                    <path fill="currentColor" d="M7.953 3.788a.5.5 0 0 0-.906 0L6.08 5.85l-2.154.33a.5.5 0 0 0-.283.843l1.574 1.613l-.373 2.284a.5.5 0 0 0 .736.518l1.92-1.063l1.921 1.063a.5.5 0 0 0 .736-.519l-.373-2.283l1.574-1.613a.5.5 0 0 0-.283-.844L8.921 5.85l-.968-2.062Z"/>
                    </symbol>

                    <symbol xmlns="http://www.w3.org/2000/svg" id="add" viewBox="0 -960 960 960">
                    <path fill="currentColor" d="M120-320v-80h280v80H120Zm0-160v-80h440v80H120Zm0-160v-80h440v80H120Zm520 480v-160H480v-80h160v-160h80v160h160v80H720v160h-80Z"/>
                    </symbol>

                    <symbol xmlns="http://www.w3.org/2000/svg" id="edit" viewBox="0 -960 960 960">
                    <path fill="currentColor" d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                    </symbol>

                    <symbol xmlns="http://www.w3.org/2000/svg" id="delete" viewBox="0 -960 960 960">
                    <path fill="currentColor" d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </symbol>
                    <symbol xmlns="http://www.w3.org/2000/svg" id="add-cart" viewBox="0 -960 960 960">
                    <path fill="currentColor" d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z"/>
                    </symbol>
                </defs>
            </svg>

            <div class="preloader-wrapper">
                <div class="preloader">
                </div>
            </div>

            <header class="fixed-top">
                <div class="container-fluid">
                    <div class="row py-3">
                        <div class="d-flex  justify-content-center justify-content-between align-items-center">
                            <nav class="main-menu d-flex navbar navbar-expand-xl">

                                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
                                    aria-controls="offcanvasNavbar">
                                    <span class="navbar-toggler-icon"></span>
                                </button>

                                <div class="navbar-logo px-2 d-md-none">
                                    <h4 class="m-0">Matt</h4>
                                </div>

                                <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">

                                    <div class="offcanvas-header justify-content-center">
                                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                    </div>

                                    <div class="offcanvas-body align-items-center">
                                
                                    <ul class="navbar-nav justify-content-end menu-list list-unstyled d-flex gap-md-3 mb-0">
                                        <li class="nav-item active"><a href="/index.html" class="nav-link text-dark">首頁</a></li>
                                        <li class="nav-item"><a href="/about.html" class="nav-link text-dark">關於我們</a></li>
                                        <li class="nav-item"><a href="/news.html" class="nav-link text-dark">訊息公佈</a></li>
                                        <li class="nav-item"><a href="/teach.html" class="nav-link text-dark">繪畫課程</a></li>

                                        <li class="nav-item d-none d-xl-block"><a href="/shop.html" class="nav-link text-dark">全部商品</a></li>

                                        <li class="nav-item dropdown d-block d-xl-none">
                                            <a class="nav-link dropdown-toggle text-dark" role="button" id="pages" data-bs-toggle="dropdown" aria-expanded="false">全部商品</a>
                                                <ul class="dropdown-menu" aria-labelledby="pages">
                                                    <li><a class="dropdown-item text-dark" href="/shop.html?tab=nav-mirror">鏡子</a></li>
                                                    <li><a class="dropdown-item text-dark" href="/shop.html?tab=nav-coaster">杯墊</a></li>
                                                    <li><a class="dropdown-item text-dark" href="/shop.html?tab=nav-magnet">磁鐵</a></li>
                                                    <li><a class="dropdown-item text-dark" href="/shop.html?tab=nav-wood">木板畫</a></li>
                                                    <li><a class="dropdown-item text-dark" href="/shop.html?tab=nav-painting">大畫</a></li>
                                                </ul>
                                        </li>

                                        <li class="nav-item"><a href="/contact.html" class="nav-link text-dark">擺攤位置</a></li>
                                    </ul>
                                    
                                    <div class="search-bar row bg-light p-2 my-2 rounded-4 ms-lg-5">
                                        <form id="search-form" class="d-flex w-100" action="/search.html" method="get">
                                        <div class="col-11">
                                            <input type="text" name="keyword" class="form-control border-0 bg-transparent" placeholder="找商品" />
                                        </div>
                                        <div class="col-1">
                                            <button type="submit" class="btn border-0 bg-transparent p-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"/>
                                            </svg>
                                            </button>
                                        </div>
                                        </form>
                                    </div>

                                    
                                    </div>

                                </div>
                            
                            </nav>
                            <ul class="d-flex justify-content-end list-unstyled m-0">
                            <li>
                                <a href="#" class="rounded-circle bg-light p-2 mx-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlink:href="#cart"></use></svg>
                                <span class="position-absolute top-10 start-10 translate-middle badge rounded-pill bg-primary cart-count"></span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="rounded-circle bg-light p-2 mx-1">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlink:href="#heart"></use></svg>
                                </a>
                            </li>
                            <li>
                                <a href="/login.html" class="rounded-circle bg-light p-2 mx-1">
                                <svg width="24" height="24" viewBox="0 0 24 24"><use xlink:href="#user"></use></svg>
                                </a>
                            </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasCart" aria-labelledby="My Cart">
                <div class="offcanvas-header justify-content-center">
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div class="order-md-last">
                    <h4 class="d-flex justify-content-between align-items-center mb-3">
                        <span class="text-primary">目前已選購商品</span>
                    </h4>
                    <ul class="list-group mb-3 cart-list">
                        
                    </ul>
            
                    <button class="w-100 btn btn-primary btn-lg" type="submit" onclick="location.href='/myorder.html';">前往結帳</button>
                    </div>
                </div>
            </div>
        `;

        var footer = `
            <footer class="py-5">
                <div class="container-fluid">
                    <div class="row">

                    <div class="col-lg-6 col-md-4">
                        <div class="footer-menu">
                            <img src="/assets/img/a.png" style="width: 200px; height: 200px;">
                        </div>
                    </div>

                    <div class="col-lg-2 col-md-2">
                        <div class="footer-menu">
                            <h5 class="widget-title">Matt Art</h5>
                            <ul class="menu-list list-unstyled">
                                <li class="menu-item">
                                <a href="/shop.html" class="nav-link">關於我們</a>
                                </li>
                                <li class="menu-item">
                                <a href="/shop.html" class="nav-link">訊息公布</a>
                                </li>
                                <li class="menu-item">
                                <a href="/shop.html" class="nav-link">繪畫課程</a>
                                </li>
                                <li class="menu-item">
                                <a href="/shop.html" class="nav-link">全部商品</a>
                                </li>
                                <li class="menu-item">
                                <a href="/shop.html" class="nav-link">擺攤位置</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-2">
                        <div class="footer-menu">
                        <h5 class="widget-title">顧客服務</h5>
                        <ul class="menu-list list-unstyled">
                            <li class="menu-item">
                            <a href="#" class="nav-link">常見問題</a>
                            </li>
                            <li class="menu-item">
                            <a href="#" class="nav-link">客製化服務</a>
                            </li>
                        </ul>
                        </div>
                    </div>

                    <div class="col-lg-2 col-md-2">
                        <div class="footer-menu">
                        <h5 class="widget-title">聯絡資訊</h5>
                        <ul class="list-unstyled">
                            <li>ADD: 123456789</li>
                            <li>TEL: 123456789</li>
                            <li>FAX: 123456789</li>
                            <li>E-MAIL: 123456789@gmail.com</li>
                        </ul>
                        </div>
                    </div>
                    
                    </div>
                </div>
            </footer>
        `;
        $('body').prepend(header);
        $('body').append(footer);
    }

    $(document).ready(function() {
        initLayout();
        initPreloader();
        loadCartFromCookie();
        renderCart();
        /**
          * 商品加入購物車
          */
        $(document).on('click', '.add-to-cart', function(e) {
            e.preventDefault();

            const $btn = $(this);
            const code = $btn.data('code'); // M0001
            const productList = getProductList();
            const product = Object.values(productList).flat().find(p => p.datacode === code);

            if (product) {
            console.log('✅ 找到商品:', product.feature);
            const cart = getCart();

            // 1️⃣ 檢查是否已存在（同 category + id）
            const item = cart.find(p => p.datacode === code);

            if (!item) {
                cart.push({
                ...product,
                purchaseQty: 1
                });
            }
            setCart(cart);
            renderCart();
            } else {
            console.error('❌ 商品不存在:', code);
            }
        });
        /**
          * 從購物車內刪除商品
          */
        $(document).on('click', '.delete-item', function(e) {
            e.preventDefault();

            const ok = window.confirm(
                "確定要刪除?"
            );
            if (!ok) return;

            const $btn = $(this);
            const code = $btn.data('code'); // M0001

            let cart = getCart();

            // 過濾掉要刪除的商品（根據 datacode）
            const newCart = cart.filter(item => item.datacode !== code);

            if (newCart.length === cart.length) {
                console.warn('❌ 購物車中找不到商品:', code);
                return;
            }
            setCart(newCart);
            renderCart();
        });
    });
})(jQuery);