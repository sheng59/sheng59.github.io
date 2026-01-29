import {setCookie, loadCartFromCookie, renderCart, getCart, setCart} from './modules/cart.js';
import {createProduct, renderNewProducts, renderHotProducts, renderAllProducts, getProductList, renderBackendProduct, renderOrdertList, getPaymentAmt, setPaymentAmt} from './modules/product.js';

(function($) {

  "use strict";

    function updateOrderItemPrice(code, newQty, price) {
        const $select = $(`.select-quantity[data-code="${code}"]`);
        const $row = $select.closest('tr');

        $row.find('td:eq(4)').text(`$${newQty*price}`);
    }

    // document ready
    $(document).ready(function() {
        let isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const cart = getCart();

        if (isMobileDevice) {
            renderOrdertList('mobile', cart);
        } else {
            renderOrdertList('desktop', cart);
        }
        /**
          * 結帳頁面數量選擇
          */
        $(document).on('change', '.select-quantity', function(e) {
            e.preventDefault();

            const code = $(this).data('code');
            const newQty = parseInt($(this).val());
            const totalAmount = $('#total-amount');
            let newPayAmt = 0;

            if (!newQty) return;

            let cart = getCart();
            const product = cart.find(item => item.datacode === code);
            if (product) {
                product.purchaseQty = newQty;
                setCart(cart);
                renderCart();
                updateOrderItemPrice(code, newQty, product.price);
                cart.forEach(c => {
                    newPayAmt += (c.price * c.purchaseQty);
                });
                totalAmount.text(`$${newPayAmt}`);
                setPaymentAmt(newPayAmt);
            }
        });
        /**
          * 結帳頁面刪除商品
          */
        $(document).on('click', '.delete-shop-item', function(e) {
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
                console.warn('❌ 購物清單中找不到商品:', code);
                return;
            }
            setCart(newCart);
            renderCart();
            if (isMobileDevice) {
                renderOrdertList('mobile', newCart);
            } else {
                renderOrdertList('desktop', newCart);
            }
        });

    }); // End of a document

})(jQuery);