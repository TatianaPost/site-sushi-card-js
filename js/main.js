(() => {
	const items = JSON.parse(localStorage.getItem('products')) || [
		{
			id: 0,
			title: 'Калифорния хит',
			price: 300,
			weight: 180,
			itemsInBox: 6,
			img: 'california-hit.jpg',
			counter: 1
		},
		{
			id: 1,
			title: 'Калифорния темпура',
			price: 250,
			weight: 205,
			itemsInBox: 6,
			img: 'california-tempura.jpg',
			counter: 1
		},
		{
			id: 2,
			title: 'Филадельфия',
			price: 280,
			weight: 180,
			itemsInBox: 6,
			img: 'philadelphia.jpg',
			counter: 1
		},
		{
			id: 3,
			title: 'Запечённая колифорния',
			price: 350,
			weight: 230,
			itemsInBox: 6,
			img: 'zapech-california.jpg',
			counter: 1
		},
	];
	//Локал корзины
	let cart = JSON.parse(localStorage.getItem('cart')) || [];
	let cartObj = {};
	//Счетчик для counter
	let count = 1;
	//Хранилищье общей суммы за товар
	let summa = parseFloat(localStorage.getItem('summa')) || 0;

	//DOM
	let products = document.querySelector('#products');
	let myProducts = document.querySelector('.my-products');
	let cartBox = document.querySelector('.cart-box');
	let totalPrice = document.querySelector('.total-price');
	let myCard = document.querySelector('.my-card');
	let alertSecondary = document.querySelector('.alert-secondary');

	//Рендерим товар
	const renderItem = item => {
		localStorage.setItem('products', JSON.stringify(items))
		const markup = 
		`
		<div class="col-md-6">
			<div class="card mb-4">
				<img class="product-img" src="img/roll/${item.img}" alt="${item.title}">
				<div class="card-body text-center">
					<h4 class="item-title">${item.title}</h5>
					<p><small class="text-muted">${item.itemsInBox} шт.</small></p>

					<div class="details-wrapper">
						<div class="items">
							<div class="items__control" data-btn="-" data-id="${item.id}">-</div>
							<div class="items__current">${item.counter}</div>
							<div class="items__control" data-btn="+" data-id="${item.id}">+</div>
						</div>

						<div class="price">
							<div class="price__weight">${item.weight}г.</div>
							<div class="price__currency">${item.price} ₽</div>
						</div>
					</div>

					<button type="button" class="btn btn-block btn-outline-warning cart-btn" data-id="${item.id}">+ в корзину</button>
					
				</div>
			</div>
		</div>
	`;

	myProducts.insertAdjacentHTML('beforeend', markup);
	}
	items.forEach(renderItem);

	//Да начнется Жесть)))))))))))))))))))))))
	products.addEventListener('click', e => {
		//Получаем плюс минус
		let btn = e.target.closest('.items__control');
		//Получаем кнопки в Корзину
		let cartBtn = e.target.closest('.cart-btn');
		//Кнопки корзины
		let cardBtn = e.target.closest('.items__control');
		//Товар плюс - минус
		if(btn) {
			//Получаем ид из btn
			let id = btn.getAttribute('data-id');
			switch(btn.getAttribute('data-btn')){
				case '-':
				//Если коунтер равен одному отменяем клик
				if(items[id].counter === 1){return false};
				//Добавляем в счетчтик значение из counter
				count = items[id].counter;
				//Минусуем счетчик
				count--;
				setLocal(id, count);
					break;
				case '+':
				count = items[id].counter;
				count++;
				setLocal(id, count);
					break;
			}
		}
		//Корзина
		if(cartBtn) {
			//Получаем ид для выбора заказа по индексу
			let id = cartBtn.getAttribute('data-id');
			//Обнуляем чтобы товары не повторялись при рендере
			cartBox.innerHTML = '';
			//Перезапись локала
			cart = JSON.parse(localStorage.getItem('cart')) || [];
			//Создаем товар и впихиваем в объект
			cartObj.id = items[id].id;
			cartObj.title = items[id].title;
			cartObj.price = items[id].price * items[id].counter;
			cartObj.weight = items[id].weight * items[id].counter;
			cartObj.itemsInBox = items[id].itemsInBox * items[id].counter;
			cartObj.img = items[id].img;
			cartObj.counter = items[id].counter;
			//Пушим в массив
			var cartI = cart.findIndex(i => i.id === cartObj.id);
			if (cart[cartI]) {
				//Если такой элемент сущиствует прибавляем
				cart[cartI].counter = cart[cartI].counter + cartObj.counter;
				cart[cartI].price = cart[cartI].price + cartObj.price;
				cart[cartI].weight = cart[cartI].weight + cartObj.weight;
				cart[cartI].itemsInBox = cart[cartI].itemsInBox + cartObj.itemsInBox;
			}else{
				cart.push(cartObj)
			};
			//cart.push(cartObj);
			//Сумируем товар
			summa += cartObj.price;
			//Перезаписываем сумму в локал
			localStorage.setItem('summa', summa);
			//Перезаписываем товар в локал
			localStorage.setItem('cart', JSON.stringify(cart));
			//Рендерим повторно
			cart.forEach(renderCart);
			//Обнуляем счетчик
			items[id].counter = 1;
			//Обнуляем товар
			myProducts.innerHTML = '';
			items.forEach(renderItem);
		}
		//Корзина плюс - минус
		if(cardBtn) {
			let cardId = cardBtn.getAttribute('data-id');
			let cardItemsId = cardBtn.getAttribute('data-card-id');
			switch(cardBtn.getAttribute('data-card')){
				case '-':
				if(cart[cardId].counter === 1){
					summa -= cart[cardId].price;
					//Перезаписываем сумму в локал
					localStorage.setItem('summa', summa);
					cart.splice(cardId, 1);
					localStorage.setItem('cart', JSON.stringify(cart));
					//Обнуляем чтобы товары не повторялись при рендере
					cartBox.innerHTML = '';
					cart.forEach(renderCart);
					if(cart.length === 0) {
						myCard.classList.remove('my-card-on');
						alertSecondary.textContent = `Корзина пуста`;
					}
				}else{
					count = cart[cardId].counter;
					count--;
					//Минисуем цену
					cart[cardId].price = cart[cardId].price - items[cardItemsId].price;
					summa -= items[cardItemsId].price;
					//Вес
					cart[cardId].weight = cart[cardId].weight - items[cardItemsId].weight;
					//Штук
					cart[cardId].itemsInBox = cart[cardId].itemsInBox - items[cardItemsId].itemsInBox;
					setCardCounter(cardId, count);
				}
					break;
				case '+':
				count = cart[cardId].counter;
				count++;
				cart[cardId].price = cart[cardId].price + items[cardItemsId].price;
				summa += items[cardItemsId].price;
				//Вес
				cart[cardId].weight = cart[cardId].weight + items[cardItemsId].weight;
				//Штук
				cart[cardId].itemsInBox = cart[cardId].itemsInBox + items[cardItemsId].itemsInBox;
				setCardCounter(cardId, count);
					break;
			}
		}
	});
	//Функция для перезаписи Counter
	function setLocal(id, count) {
		//Получаем counter по индексу массива
		items[id].counter = count;
		//Обнуляем товар
		myProducts.innerHTML = '';
		//Рендерим
		items.forEach(renderItem);
		localStorage.setItem('products', JSON.stringify(items))
	}
	//Функция для перезаписи Counter выбранного товара
	function setCardCounter(id, count){
		cart[id].counter = count;
		//Обнуляем чтобы товары не повторялись при рендере
		cartBox.innerHTML = '';

		//Перезаписываем сумму в локал
		localStorage.setItem('summa', summa);
		cart.forEach(renderCart);
		localStorage.setItem('cart', JSON.stringify(cart))
	}
	//Корзина
	const renderCart = (cartItem, i) => {
		const markupCart = `
			<div class="cart-item">
				<div class="cart-item__top">
					<div class="cart-item__img">
						<img src="img/roll/${cartItem.img}" alt="${cartItem.title}">
					</div>
					<div class="cart-item__desc">
						<div class="cart-item__title">${cartItem.title}</div>
						<div class="cart-item__weight">${cartItem.itemsInBox} шт. / ${cartItem.weight}г.</div>

						<!-- cart-item__details -->
						<div class="cart-item__details">

							<div class="items items--small">
								<div class="items__control" data-card="-" data-id="${i}" data-card-id="${cartItem.id}">-</div>
								<div class="items__current">${cartItem.counter}</div>
								<div class="items__control" data-card="+" data-id="${i}" data-card-id="${cartItem.id}">+</div>
							</div>

							<div class="price">
								<div class="price__currency">${cartItem.price} ₽</div>
							</div>

						</div>

					</div>
				</div>
			</div>`;
			//Выносим заказы
			cartBox.insertAdjacentHTML('afterbegin', markupCart);
			//Присваиваем общую сумму
			totalPrice.textContent = summa;
			//Если корзина не пуста показываем сумму и т.д
			if(i+1 !== 0) {
				myCard.classList.add('my-card-on');
				alertSecondary.textContent = `Заказов (${i+1})`;
			}
	}
	cart.forEach(renderCart);
})();