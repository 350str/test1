const page = document.querySelector('.page');
const buyButton = document.querySelector('.popup__button_buy');
const basket = document.querySelector('.basket-icon');
const sellout = document.querySelector('.sellout');
const basketData = new Array;

const createBook = (image, title, subtitle, url, price, isbn) =>  {
    const bookContainer = document.querySelector(".books-container");
    const book = document.createElement("div");

    bookContainer.appendChild(book);
    book.classList.add("book");
    book.insertAdjacentHTML('beforeEnd', `   
        <div class="book__image"></div>
        <p class="book__title"></p>`);

    book.querySelector('.book__image').style.backgroundImage = `url(${ image })`;
    book.querySelector('.book__title').textContent = title;
    book.setAttribute('subtitle', subtitle);
    book.setAttribute('url', url);
    book.setAttribute('isbn', isbn);
    book.setAttribute('price', price);
   
}

const getBooksData = () => {
    fetch ('http://5d22b7fd4e05c600146ef4dd.mockapi.io/cupcake/books')
        .then (res => {
            if (res.ok) return res.json();
                        return Promise.reject( `Ошибка: ${ res.status }` );  
        })

        .then (json => json.books.forEach(item => {
            createBook( item.image, item.title, item.subtitle, item.url, item.price, item.isbn13 );
        }))
        .catch(err => console.log( err ));
}


const showBookPopup = (event) => {
    const popup = document.querySelector('.popup');
    const title = document.querySelector('.popup__title');
    const subtitle = document.querySelector('.popup__subtitle');
    const image = document.querySelector('.popup__image');
    const isbn = document.querySelector('.popup__isbn');
    const price = document.querySelector('.popup__price');
    const url = document.querySelector('.popup__url');
    
    if (event.target.classList.contains('book__image')) {
        console.log(event.target);
        popup.classList.add('popup_is-opened');
        title.textContent = event.target.nextElementSibling.textContent;
        image.setAttribute('src', event.target.style.backgroundImage.slice(5, event.target.style.backgroundImage.length-2));
        
        subtitle.textContent = event.target.parentElement.getAttribute('subtitle');
        isbn.textContent = event.target.parentElement.getAttribute('isbn');
        price.textContent = event.target.parentElement.getAttribute('price');
        url.href = event.target.parentElement.getAttribute('url');
  
    };
}

const changeVal = () => {
    const minusVal = document.querySelector('.popup__button_minus');
    const plusVal = document.querySelector('.popup__button_plus');
    const input = document.querySelector('.popup__input');
    minusVal.onclick = () => {
            if (+input.textContent > 1) input.textContent = +input.textContent - 1
        };
    plusVal.onclick = () => 
                input.textContent = +input.textContent + 1;
}

const popupClose = (event) => {
    if (event.target.classList.contains('popup__close'))
    event.target.parentElement.parentElement.classList.remove('popup_is-opened');
};

const showBasket = () => {
    const table = document.querySelector('.basket__table');
    sellout.classList.add('popup_is-opened');
    basketData.forEach((item, index) => {
    table.insertAdjacentHTML('beforeEnd', ` 
    <th scope="row">${ index + 1 }</th>  
    <td>${ item.title }</td>
    <td>${ item.count }</td>
    <td>${ item.totalPrice }</td>`);

    })
}

const selloutTabFill = () => {
    console.log(event.target.parentElement.parentElement);
    const data = new Object;
    
    data.title = event.target.parentElement.parentElement.querySelector('.popup__title').textContent;
    data.count = event.target.parentElement.parentElement.querySelector('.popup__input').textContent;
    data.totalPrice = (+event.target.parentElement.parentElement.querySelector('.popup__price').textContent * +data.count).toFixed(2);
    basketData.push(data);
    alert('Товар добавлен в корзину!');
    console.log(basketData);
    document.querySelector('.popup__input').textContent = 1;
}

getBooksData();
changeVal();

page.addEventListener('click', showBookPopup);
page.addEventListener('click', popupClose);
buyButton.addEventListener('click', selloutTabFill);
basket.addEventListener('click', showBasket);

