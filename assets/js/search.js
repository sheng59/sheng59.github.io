import {createProduct, renderNewProducts, renderHotProducts, renderAllProducts, renderSearchProducts, renderBackendProduct, getProductList} from './modules/product.js';

(function($) {

    "use strict";

    /**
      * 取得網址上的查詢參數
      */
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // document ready
    $(document).ready(function() {
        const keyword = getQueryParam("keyword"); // 從網址讀取搜尋字
        if (keyword) {
            createProduct().then(() => {
                renderSearchProducts(keyword);
            });
        } else {
            createProduct().then(() => {
                renderAllProducts();
            });
        }
  }); // End of a document

})(jQuery);