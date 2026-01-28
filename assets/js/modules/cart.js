let cart = [];

const categoryMap_cn = {
    mirror: '鏡子',
    magnet: '磁鐵',
    coaster: '杯墊',
    wood: '木板畫',
    painting: '大畫'
};

/**
  * 儲存快取資料
  */
const setCookie = function(name, value, days= 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}
/**
  * 讀取快取資料
  */
const getCookie = function(name) {
    return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
}
/**
  * 刪除快取資料
  */
const deleteCookie = function(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
}
/**
  * 載入購物車資料
  */
const loadCartFromCookie = function() {
    const cookieCart = getCookie('cart');
    if (cookieCart) {
        try {
            cart = JSON.parse(decodeURIComponent(cookieCart));
        } catch (e) {
            cart = [];
        }
    }
}
/**
  * 儲存購物車資料
  */
const saveCartToCookie = () => {
    setCookie('cart', JSON.stringify(cart), 7);
}
/**
  * 渲染購物車商品
  */
const renderCart = function() {
    const cartList = document.querySelector('.cart-list');
    const badge = document.querySelector('.cart-count');

    cartList.innerHTML = "";

    let totalQty = 0;

    if (cart.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'list-group-item text-center text-muted py-4';
        emptyMessage.textContent = '目前購物車內沒有商品！';
        cartList.appendChild(emptyMessage);

        // 隱藏 badge
        badge.style.display = 'none';
    } else {
        cart.forEach(item => {
        const cate_cn = categoryMap_cn[item.category];
        //totalQty += item.purchaseQty;
        totalQty += 1;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between lh-sm';

        li.innerHTML = `
            <div>
                <div class="my-2">${item.feature}樣式${cate_cn}</div>
                <div class="my-2 text-danger fw-bold">
                    $${item.price}
                </div>
            </div>
            <span class="my-2 delete-item" data-key="${item.category}-${item.id}" data-code="${item.datacode}" style="cursor: pointer;">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <use xlink:href="#delete"></use>
                </svg>
            </span>
            `;

            cartList.appendChild(li);
        });
    }

    // 🔴 更新 badge
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? 'inline-block' : 'none';
}

const getCart = () => cart;

const setCart = (newCart) => {
    cart = newCart;
    saveCartToCookie();
}

export {setCookie, getCookie, deleteCookie, loadCartFromCookie, renderCart, getCart, setCart};