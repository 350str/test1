const page = document.querySelector('.page');
const buyButton = document.querySelector('.popup__button_buy');
const basketIcon = document.querySelector('.basket-icon__image');
const basketData = new Array;

// *** Функция создания книги путем рендера данных с сервера (рендер) ***

const createBook = ( { image, title, subtitle, url, price, isbn13 } ) =>  {
    const book = document.createElement("div");
    book.classList.add('book');
    document.querySelector('.books-container').append(book);

    book.insertAdjacentHTML('beforeEnd', `   
        <div class="book__image"></div>
        <p class="book__title"></p>`);

    book.querySelector('.book__image').style.backgroundImage = `url(${ image })`;
    book.querySelector('.book__title').textContent = title;

    book.setAttribute('subtitle', subtitle);
    book.setAttribute('url', url);
    book.setAttribute('isbn13', isbn13);
    book.setAttribute('price', price);

}

// *** Получение данных с сервера и последующий рендер через createBook ***

const getBooksData = () => {
    fetch ( 'http://5d22b7fd4e05c600146ef4dd.mockapi.io/cupcake/books' )
        .then (res => {
            if (res.ok) return res.json();
                        return Promise.reject( `Ошибка: ${ res.status }` );  
        })

        .then (json => json.books.forEach( item => createBook( item )) )
        .catch(err => console.log( err ));
}

// *** Создаем данные для popup-ов  ***

const createPopupInfo = () => {
    
    const title = document.querySelector('.popup__title');
    const image = document.querySelector('.popup__image');
    const parent = event.target.parentElement;
    const bgImage =  event.target.style.backgroundImage;

    title.textContent = event.target.nextElementSibling.textContent;
    image.setAttribute('src', bgImage.slice(5, bgImage.length-2));
    image.setAttribute('alt', title.textContent);
    
    document.querySelector('.popup__subtitle').textContent = parent.getAttribute('subtitle');
    document.querySelector('.popup__isbn13').textContent = parent.getAttribute('isbn13');
    document.querySelector('.popup__price').textContent = parent.getAttribute('price');
    document.querySelector('.popup__url').href = parent.getAttribute('url');

}

// *** Открываем popup при клике и заполняем контентом ***

const showBookPopup = (event) => {
    
    if (event.target.classList.contains('book__image')) {
        document.querySelector('.book-popup').classList.add('popup_is-opened');
        createPopupInfo();
    };
}

// *** Функция для выбора количества товара ***

const changeVal = () => {
    const minus = document.querySelector('.popup__button_minus');
    const plus = document.querySelector('.popup__button_plus');
    const counter = document.querySelector('.popup__counter');
    minus.onclick = () => {
            if (+counter.textContent > 1) 
                counter.textContent = +counter.textContent - 1
            };
    plus.onclick = () => 
            counter.textContent = +counter.textContent + 1;
}

// *** Закрываем все popup-ы содержащие popup__close ***

const popupClose = (event) => {
    if (event.target.classList.contains('popup__close'))
    event.target.parentElement.parentElement.classList.remove('popup_is-opened');
};

//

const showBasket = () => {
    document.querySelectorAll('.table__item').forEach( item => item.remove() );
    document.querySelector('.basket-popup').classList.add('popup_is-opened');

    basketData.forEach(( item, index ) => {
    document.querySelector('.basket__table').insertAdjacentHTML('beforeEnd', ` 
        <th scope="row" class="table__item table__counter">${ index + 1 }</th>  
        <td class="table__item">${ item.title }</td>
        <td class="table__item table__val">${ item.count }</td>
        <td class="table__item table__val">${ item.totalPrice }</td>
        `)
       // <td class="table__item"><button class="btn btn-warning">Del</button></td>
    })
}

const basketContent = () => {

    const data = new Object;
    const currentBook = event.target.parentElement.parentElement;
    const counter = currentBook.querySelector('.popup__counter');

    data.title = currentBook.querySelector('.popup__title').textContent;
    data.count = counter.textContent;
    data.totalPrice = (+currentBook.querySelector('.popup__price').textContent * +data.count).toFixed(2);

    const index = basketData.findIndex(item => item.title === data.title);

    // *** Проверяем есть ли в массиве ранее добавленная книга ***
    if (index !== -1) {
        basketData[index].count = +basketData[index].count + +data.count;
        basketData[index].totalPrice = (+basketData[index].totalPrice + +data.totalPrice).toFixed(2);
    } else 
        basketData.push(data);
    
    alert('Товар добавлен в корзину!');
    basketIcon.setAttribute('src', './images/shoppingbasket_full.svg');
    document.querySelector('.basket-icon__counter').textContent = basketData.reduce( (prev, curr) => prev + +curr.count, 0 );
    counter.textContent = 1;
}

const removeBook = () => {
    if (event.target.classList.contains('table__button')) {
        console.log(event.target.parentElement.parentElement);
        
    };
}
getBooksData();
changeVal();

page.addEventListener('click', showBookPopup);
page.addEventListener('click', popupClose);
page.addEventListener('click', removeBook);
buyButton.addEventListener('click', basketContent);
basketIcon.addEventListener('click', showBasket);