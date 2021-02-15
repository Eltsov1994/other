let cartArr = [];
let cart = {};

//Сохраняем в корзину
function saveToCart(vendorCode, select) {
   if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
   }
   let count = Object.keys(cart).length + 1;
   cart[count] = {};
   cart[count][vendorCode] = select;
   localStorage.setItem('cart', JSON.stringify(cart));

}


function syncStorageSQL() {
   if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
   }

   let formData = new FormData();

   for (key in cart) {
      for (key2 in cart[key]) {
         const vendorCode = key2;
         const select = cart[key][key2];

         let dataObj = { 'product_id': vendorCode, 'option': select };
         formData.append(key, JSON.stringify(dataObj));

      }
   }


   //AJAX
   async function ajax() {
      let response = await fetch('index.php?route=checkout/cart/add', {
         method: 'POST',
         body: formData,
      });
   }

   ajax();



}


//Отображаем бэйдж корзины
bageCart();
function bageCart() {
   let LocalStorage = JSON.parse(localStorage.getItem('cart'));
   if (!localStorage.cart || !Object.keys(LocalStorage).length) {
      let cart = document.querySelector('.header__cart');
      cart.innerHTML = '';
   } else {
      let LocalStorageArr = Object.keys(JSON.parse(localStorage.getItem('cart')));
      let body = document.querySelector('.header__cart');
      let span = document.createElement('span');
      body.innerHTML = '';
      span.innerHTML = LocalStorageArr.length;
      body.appendChild(span);
   }
}


// 
buildCart();
function buildCart() {
   let cartArr = [];
   let LocalStorage = JSON.parse(localStorage.getItem('cart'));
   let popup = document.querySelector('.popup-cart');

   if (!localStorage.cart || !Object.keys(LocalStorage).length) {
      cartEmpty();
   } else {
      cartFull();
   }


   function cartFull() {
      popup.classList.remove('empty');
      let LocalStorageArr = Object.keys(LocalStorage);
      for (let index = 0; index < LocalStorageArr.length; index++) {
         const LocalStorageArrItem = Object.keys(LocalStorage[LocalStorageArr[index]])[0];

         for (let index = 0; index < item_id.length; index++) {
            const item_idItem = item_id[index];
            if (item_idItem['vendorCode'] == LocalStorageArrItem) {
               cartArr.push(item_idItem);
            }
         }
      }

      buildCartItem();
      function buildCartItem() {
         // Top
         top();
         function top() {
            let UID = new Date().valueOf();
            let body = document.querySelector('.popup-cart__top');
            let title = document.createElement('h3');
            title.innerHTML = 'Оформление заказа';
            let p = document.createElement('p');
            p.innerHTML = `Заказ № ${UID}`;

            body.innerHTML = '';
            body.appendChild(title);
            body.appendChild(p);
         }

         // Mid
         mid();
         function mid() {
            let priceArr = [];
            let wrapper = document.createElement('div');
            let body = document.querySelector('.popup-cart__mid');
            body.innerHTML = '';

            let pCount = document.createElement('p');
            pCount.classList.add('popup-cart__mid-p');
            pCount.innerHTML = `Товаров в заказе: ${LocalStorageArr.length} шт.`;
            wrapper.appendChild(pCount);
            body.appendChild(wrapper);


            let pSum = document.createElement('p');
            let spanSum = document.createElement('span');
            let sumPrice = 0;
            for (let index = 0; index < cartArr.length; index++) {
               const cartArrItem = cartArr[index];
               const sizes = cartArrItem['size'];

               for (key in sizes) {
                  const size = sizes[key];
                  if (size == Object.values(LocalStorage[index + 1])[0]) {
                     priceArr.push(cartArrItem['price'][key]);
                     sumPrice = sumPrice + parseInt(cartArrItem['price'][key]);
                  }
               }
            }
            pSum.classList.add('popup-cart__mid-p');
            spanSum.innerHTML = `${sumPrice}`;
            spanSum.classList.add('_rub');
            spanSum.classList.add('_price');
            pSum.innerHTML = `Общая сумма заказа: `;
            pSum.appendChild(spanSum);
            wrapper.appendChild(pSum);
            body.appendChild(wrapper);


            let midWrapper = document.createElement('div');
            midWrapper.classList.add('popup-cart__mid-p');
            midWrapper.classList.add('popup-cart__details');
            midWrapper.classList.add('_spollers');
            midWrapper.innerHTML = `
            		<div class="popup-cart__details-title _spoller _active">
							<p>Состав заказа: <span class="_icon-arrowbottom"></span></p>
						</div>
						<div class="popup-cart__details-body cart-details">
							<div class="cart-details__items"></div>
						</div>
         `;
            wrapper.appendChild(midWrapper);
            body.appendChild(wrapper);


            buildCartItemItem();
            function buildCartItemItem() {
               let body = document.querySelector('.cart-details__items');
               body.innerHTML = '';
               for (let index = 0; index < cartArr.length; index++) {
                  const cartArrItem = cartArr[index];
                  const wrapper = document.createElement('div');
                  const sizes = cartArrItem['size'];
                  let price;
                  let size;

                  for (key in sizes) {
                     const sizeTMP = sizes[key];
                     if (sizeTMP == Object.values(LocalStorage[index + 1])[0]) {
                        price = cartArrItem['price'][key];
                        size = cartArrItem['size'][key]
                     }
                  }


                  wrapper.classList.add('.cart-details__item');
                  wrapper.innerHTML = `
            				<div class="cart-details__item">
									<div class="cart-details__top">
										<img src="${cartArrItem['picture']}" alt="Велосипед">
									</div>
									<div class="cart-details__mid _${index}">
										<div class="cart-details__name">
											<h4>Название</h4>
											<p>${cartArrItem['name']}</p>
										</div>
										<div class="cart-details__character">
											<h4>Описание</h4>
											<p>${size}</p>
										</div>
										<div class="cart-details__price">
											<h4>Цена</h4>
											<p class="_price">${price}<span class="_rub"></span></p>
										</div>
									</div>
									<div class="cart-details__bottom">
										<div data-da="._${index}, 767.98, last" data-trash="${index}" class="cart-details__clear _icon-trash">
										</div>
									</div>
                        </div>`;

                  body.appendChild(wrapper);
                  halfedPrice();
                  spollers(); //Перезарпускаем сборку Spoller
               }
            }

         }

         // Bottom
         bottom();
         function bottom() {
            let body = document.querySelector('.popup-cart__bottom');
            body.innerHTML = `<a href="" class="form__button btn main__button checkout__link">Оформить заказ</a>`;
         }
      }
   }

   function cartEmpty() {
      const top = document.querySelector('.popup-cart__top');
      const mid = document.querySelector('.popup-cart__mid');
      const bottom = document.querySelector('.popup-cart__bottom');

      popup.classList.add('empty');

      top.innerHTML = '';
      mid.innerHTML = '';
      bottom.innerHTML = '';

      // MID
      creatMid();
      function creatMid() {
         let wrapper = document.createElement('div');
         wrapper.classList.add('cart-empty');
         wrapper.innerHTML = `
            <p>Корзина пока пуста</p>
            <img src="image/catalog/bicycle.svg" alt="">
         `;
         mid.appendChild(wrapper);
      }

      // BOTTOM
      creatBottom();
      function creatBottom() {
         let button = document.createElement('button');
         button.classList.add('_popup-close__user');
         button.classList.add('main__button');
         button.classList.add('btn');
         button.innerHTML = 'Продолжить покупки';
         bottom.appendChild(button);
      }

      listenContinue();
      function listenContinue() {
         let button = bottom.querySelector('._popup-close__user');
         button.addEventListener('click', () => {
            //Закрываем POPUP
            button.closest('.popup').classList.remove('_active');
            history.pushState('', '', window.location.href.split('#')[0]);
            body_lock_remove(500);
         });
      }

      //Refresh
      bageCart();
      refreshButton();
      popupRefresh();

      function refreshButton() {
         let button = document.querySelector('._popup_character__open');
         if (button) {
            let wrapper = button.closest('.product-item__row');
            wrapper.className = 'product-item__row';
            wrapper.innerHTML = `
            <a href="#character" class="product-item__buy main__button _popup-link _popup_character__open">Добавить в корзину</a>
         `;
         }
      }
   }

}




// ФУНКЦИЯ для удаления из корзины
function delCart(id) {
   let LocalStorageArr = JSON.parse(localStorage.getItem('cart'));
   delete LocalStorageArr[id + 1];

   let LocalStorageArrTMP = [];
   for (key in LocalStorageArr) {
      LocalStorageArrTMP.push(LocalStorageArr[key]);
   }

   let LocalStorageNew = {};
   for (let i = 0; i < LocalStorageArrTMP.length; ++i) {
      LocalStorageNew[i + 1] = LocalStorageArrTMP[i];
   }

   localStorage.removeItem('cart');
   localStorage.setItem('cart', JSON.stringify(LocalStorageNew));
}



// Клик по кнопке УДАЛИТЬ
clickDelete();
function clickDelete() {
   document.addEventListener('click', (e) => {
      let targetClass = e.target.classList;

      targetClass.forEach(element => {
         if (element == 'cart-details__clear') {
            const dataTrash = parseInt(e.target.getAttribute('data-trash'));
            delCart(dataTrash);
            buildCart();
            syncStorageSQL();
         }
      });
   });
}



// Клик по КОРЗИНЕ
clickCart();
function clickCart() {
   document.addEventListener('click', () => {
      const headerIcon = document.querySelector('.header__cart');
      const productIcon = document.querySelector('.product-item__link');

      if (headerIcon) {
         headerIcon.addEventListener('click', () => {
            refresh();
         });
      }

      if (productIcon) {
         productIcon.addEventListener('click', () => {
            refresh();
         });
      }

   });


   function refresh() {
      buildCart();
   }
}


// Слушаем STORAGE на соседних вкладках
listenStorage();
function listenStorage() {
   window.addEventListener('storage', function (e) {
      bageCart();
      buildCart();
   });
}


onPageCheckout();
function onPageCheckout() {
   let checkout = document.querySelectorAll('.checkout__link');
   if (checkout.length) {
      checkout.forEach(checkoutItem => {
         checkoutItem.addEventListener('click', (e) => {
            e.preventDefault();
            let loading = document.querySelector('.loading');
            loading.classList.add('_active');
            syncStorageSQL();
            setTimeout(() => {
               window.location = "index.php?route=checkout/checkout";
            }, 1000);
            return false;
         });
      });
   }
}