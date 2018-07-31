ymaps.ready(createMap);

/**
 * Функция построения елемента с одинм брэндом
 * @param data - объект с данными
 * @param map - карта
 * @return {HTMLDivElement} элемент для вставки в дом
 */
function createAccLink(data, map){
	let collection = new ymaps.GeoObjectCollection(null, {});
	let innerData = document.createElement('div');
	innerData.classList.add('Accord-Element', 'BigBrand-Wrap');
	
	
	//Создаем обёртку для адресов в бренде
	let brands = document.createElement('div');
	brands.classList.add('Brands', 'Accord-Content');
	
	//Цикл не убирать, иначе отвалится событие на каждом отдельном адресе
	for (let i = 0; i < data.brandData.length; i++) {
		const brand = createBrand (data.brandData[i], data.brandName, collection);
		brands.appendChild(brand);
	}
	
	//Создаем элемент для логотипа бренда
	const brandLogo = document.createElement('div');
	brandLogo.className = 'BigBrand-Logo';
	brandLogo.style.backgroundImage = `url(${data.brandLogo})`;
	
	//Создаем обёртку для информации о бренде
	const brandInfo = document.createElement('div');
	brandInfo.className = 'BigBrand-Info';
	
	//Создаем элемент для названия бренда
	const brandName = document.createElement('p');
	brandName.className = 'BigBrand-Name';
	brandName.innerText = data.brandName;
	
	//Создаем обёртку для основного адреса бренда
	const brandAddress = document.createElement('p');
	brandAddress.className = 'BigBrand-Address';
	brandAddress.innerText = data.brandAddress;
	
	//Создаем элемент для обёртки телефонов и графика работы
	const phoneWrap = document.createElement('div');
	phoneWrap.className = 'BigBrand-Phone_Wrap';
	
	//Создаем элемент для графика работы
	const brandSchedule = document.createElement('p');
	brandSchedule.className = 'BigBrand-Schedule';
	brandSchedule.innerHTML = `<p class="BigBrand-Schedule_Caption">График работы</p>`;
	//Добавляем графики работы в созданный элемент
	const scheduleMass = data.brandSchedule.split('|');
	for (let i = 0; i < scheduleMass.length; i++) {
		brandSchedule.appendChild(scheduleCreate(scheduleMass[i]))
	}
	
	
	//Создаем элемент для телефонов
	const brandPhone = document.createElement('p');
	brandPhone.className = 'BigBrand-Phone';
	brandPhone.innerHTML = `<p class="BigBrand-Phone_Caption">Телефон</p>`;
	//Добовляем телефоны в созданный элемент
	let phoneMass = data.brandPhone.split('|');
	for (let i = 0; i < phoneMass.length; i++) {
		brandPhone.appendChild(phoneCreate(phoneMass[i]));
	}
	
	
	//Создаем элемент для линка с указание количества магазинов
	const brandLink = document.createElement('a');
	const brandLinkText = document.createTextNode(`Еще ${data.brandData.length} магазинов`);
	brandLink.classList.add('BigBrand-Link', 'Accord-Link');
	brandLink.href = '#';
	brandLink.appendChild(brandLinkText);
	
	//Собираем все элементы главного элемента
	innerData.appendChild(brandLogo);
	brandInfo.appendChild(brandName);
	brandInfo.appendChild(brandAddress);
	phoneWrap.appendChild(brandSchedule);
	phoneWrap.appendChild(brandPhone);
	brandInfo.appendChild(phoneWrap);
	brandInfo.appendChild(brandLink);
	brandInfo.appendChild(brands);
	innerData.appendChild(brandInfo);
	
	brandLink.addEventListener('click', function(){
		if (!this.classList.contains('Accord-Link_Active')) {
			map.geoObjects.removeAll();
			map.geoObjects.add(collection);
			map.setBounds(map.geoObjects.getBounds());
			map.setZoom(map.getZoom() - 1);
		} else {
			map.geoObjects.removeAll();
		}
	});
	map.geoObjects.add(collection);
	return innerData;
}

/**
 * Функция построения дополнительных адресов для бренда
 * @param data - данные по адресу
 * @param brandName - имя бренда
 * @param collection - коллекция для добавления метки
 * @return {HTMLDivElement} - элемент для вставки в дом
 */
function createBrand (data, brandName, collection) {
	//Создаем обортку для адресов в бренде
	let brandWrap = document.createElement('div');
	brandWrap.className = 'Brand';
	
	//Создаем элемент для адреса
	let brandAddress = document.createElement('p');
	brandAddress.className = 'Brand-Address';
	brandAddress.innerHTML = data.address;
	brandAddress.style.cursor = 'pointer';
	
	//Создаем элемент для телефона
	let brandPhone = document.createElement('p');
	brandPhone.className = 'Brand-Phone';
	brandPhone.innerHTML = data.primoryPhone;
	
	//Создаем элемент для графика работы
	let brandSchedule = document.createElement('p');
	brandSchedule.className = 'Brand-Schedule';
	brandSchedule.innerHTML = data.primoryShedule;
	
	//Собираем все элементы
	brandWrap.appendChild(brandAddress);
	brandWrap.appendChild(brandPhone);
	brandWrap.appendChild(brandSchedule);
	
	//Разбираем и приводим к числам координаты магазина
	let coordinates = data.coordinates.split(',');
	for (let i = 0; i < coordinates.length; i++) {
		coordinates[i] = Number(coordinates[i]);
	}
	
	let placemark = new ymaps.Placemark(
		coordinates,
		{
			hintContent: brandName,
			balloonContentHeader: brandName,
			balloonContentBody: data.address,
			balloonContentFooter: data.primoryPhone
		},
		{
			iconLayout: 'default#image',
			iconImageHref: 'Item.svg',
			iconImageSize: [15,15],
			iconImageOffset: [-7,-7],
			hideIconOnBalloonOpen: false
		}
	);
	
	brandAddress.addEventListener('mouseenter', function () {
		placemark.balloon.open();
	});
	brandAddress.addEventListener('mouseleave', function () {
		placemark.balloon.close();
	});
	placemark.events
		.add('mouseenter', ()=> {
			brandWrap.style.backgroundColor = '#f2f2f2';
		})
		.add('mouseleave', ()=>{
			brandWrap.style.backgroundColor = 'transparent';
		});
	
	
	collection.add(placemark);
	return brandWrap;
}

/**
 * Функция построения элемента телефона
 * @param phone - номер телефона для вставки
 * @return {HTMLParagraphElement} - элемент для вставки в дом
 */
function phoneCreate (phone) {
	const phoneElement = document.createElement('p');
	phoneElement.className = 'BigBrand-Phone_Data';
	phoneElement.innerText += phone;
	return phoneElement;
}

/**
 * Функция построения элемента графика работы
 * @param schedule - строка с графиком работы для вставки
 * @return {HTMLParagraphElement} - элемент для вставки в дом
 */
function scheduleCreate (schedule) {
	const phoneElement = document.createElement('p');
	phoneElement.className = 'BigBrand-Schedule_Data';
	phoneElement.innerText += schedule;
	return phoneElement;
}

/**
 * Функция инициализации и построения карты
 */
function createMap(){
		//Получение данных для обработки
	$.getJSON('MapSource.json', (dataMap) => {
		//Получем элемент, где будут находяться элементы управления картой
		const mapInfo = document.getElementById('DescMap');
		
		//Получаем город
		const city = dataMap.city;
		delete dataMap.city;
		
		//Обращаемся к яндексу для получения координат центра города в котором показываем информацию
		ymaps.geocode(city).then(
			function (res) {
				//Создаем карту и показываем её на странице
				let myMap = new ymaps.Map(
					'Map',
					{
						center: res.geoObjects.get(0).geometry.getCoordinates(),
						zoom: 10,
						controls: ['zoomControl', 'fullscreenControl'],
						behaviors: ['drag', 'dblClickZoom']
					},
					{
						searchControlProvider: 'yandex#search'
					}
				);
				let accordion = document.createElement('div');
				accordion.id = 'Brands';
				accordion.className = 'Accord';
				mapInfo.appendChild(accordion);
				let i = 0;
				for (let data in dataMap.brands) {
					const accElement = createAccLink (dataMap.brands[data], myMap);
					accordion.appendChild(accElement);
					i++;
				}
				accordion.MFSAccordeon({autoClose: true});
				
			}
		);
		
	});
	console.groupEnd();
}
