let cart = [];

const categoryMap_cn = {
    mirrors: '鏡子',
    magnets: '磁鐵',
    coasters: '杯墊',
    woods: '木板畫',
    paintings: '大畫'
};

const setCookie = function(name, value, days= 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

const getCookie = function(name) {
    return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
}

const deleteCookie = function(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
}

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

const saveCartToCookie = () => {
    setCookie('cart', JSON.stringify(cart), 7);
}

const renderCart = function() {
    const cartList = document.querySelector('.cartList');
    const badge = document.querySelector('.cartCount');

    cartList.innerHTML = "";

    let totalQty = 0;

    cart.forEach(item => {
    const cate_cn = categoryMap_cn[item.category];
    totalQty += item.qty;

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between lh-sm';

    li.innerHTML = `
        <div>
        <div class="my-2">${item.feature}樣式${cate_cn}</div>
        <div class="my-2 text-danger fw-bold">
            $${item.price}
        </div>
        </div>
        <span class="my-2 delete-item" data-key="${item.category}-${item.id}" style="cursor: pointer;">
        <svg width="24" height="24" viewBox="0 0 24 24">
        <use xlink:href="#delete"></use>
        </svg>
        </span>
        `;

    cartList.appendChild(li);
    });

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