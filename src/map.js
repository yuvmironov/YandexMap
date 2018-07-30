ymaps.ready(createMap);

function createAccLink(data, map){
	let collection = new ymaps.GeoObjectCollection(null, {});
	let innerData = document.createElement('div');
	innerData.classList.add('Accord-Element', 'BigBrand-Wrap');
	
	
	//Создаем обортку для адресов в бренде
	let brands = document.createElement('div');
	brands.classList.add('Brands', 'Accord-Content');
	
	//Цикл не убирать, иначе отвалится событие на каждом отдельном адресе
	for (let i = 0; i < data.brandData.length; i++) {
		const brand = createBrand (data.brandData[i], data.brandName, collection);
		console.log('brand ', brand);
		brands.appendChild(brand);
	}
	console.log('brands ', brands);
	
	//Создаем элемент для логотипа бренда
	const brandLogo = document.createElement('div');
	brandLogo.className = 'BigBrand-Logo';
	brandLogo.style.backgroundImage = `url(${data.brandLogo})`;
	
	//Создаем обертку для информации о бренде
	const brandInfo = document.createElement('div');
	brandInfo.className = 'BigBrand-Info';
	
	//Создаем элемент для названия бренда
	const brandName = document.createElement('p');
	brandName.className = 'BigBrand-Name';
	brandName.innerText = data.brandName;
	
	//Создаем обертку для основного адреса бренда
	const brandAddress = document.createElement('p');
	brandAddress.className = 'BigBrand-Address';
	brandAddress.innerText = data.brandAddress;
	
	//Создаем элемент для оберки телефонов и графика работы
	const phoneWrap = document.createElement('div');
	phoneWrap.className = 'BigBrand-Phone_Wrap';
	
	//Создаем элемент для графика работы
	const brandSchedule = document.createElement('p');
	brandSchedule.className = 'BigBrand-Schedule';
	brandSchedule.innerHTML = `<p class="BigBrand-Schedule_Caption">График работы</p><p class="BigBrand-Schedule_Data">${data.brandSchedule}</p>`;
	
	//Создаем элемент для телефонов
	const brandPhone = document.createElement('p');
	brandPhone.className = 'BigBrand-Phone';
	brandPhone.innerHTML = `<p class="BigBrand-Phone_Caption">Телефон</p><p class="BigBrand-Phone_Data">${data.brandPhone}</p>`;
	
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


function createBrand (data, brandName, collection) {
	console.log('data ', data);

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
	
	console.log('brandWrap ', brandWrap);
	
	//Разбираем и приводим к числам координаты магазина
	let coordinates = data.coordinates.split(',');
	for (let i = 0; i < coordinates.length; i++) {
		coordinates[i] = Number(coordinates[i]);
	}
	console.log('coordinates ', coordinates);
	
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
	console.log('placemark ', placemark);
	brandAddress.addEventListener('mouseenter', function () {
		placemark.options.iconImageSize = [20,20];
		placemark.balloon.open();
	});
	
	collection.add(placemark);
	return brandWrap;
}

function createMap(){
	console.group(`Function map init load`);
	
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