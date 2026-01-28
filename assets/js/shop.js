import {createProduct, renderNewProducts, renderHotProducts, renderAllProducts, getProductList, renderBackendProduct} from './modules/product.js';

(function($) {

  "use strict";

    // document ready
    $(document).ready(function() {
        createProduct().then(() => {
            renderAllProducts();
        });

        const urlParams = new URLSearchParams(window.location.search);
        const tabId = urlParams.get('tab');

        if (tabId) {
            const tabTrigger = document.querySelector(`[data-bs-target="#${tabId}"]`);
            if (tabTrigger) {
                const tab = new bootstrap.Tab(tabTrigger);
                tab.show();
            }
        }
    }); // End of a document

})(jQuery);