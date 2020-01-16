function createBook(image, title) {
    const bookContainer = document.querySelector(".books-container");
    const book = document.createElement("div");

    bookContainer.appendChild(book);
    book.classList.add("book");
    book.insertAdjacentHTML('beforeEnd', `   
        <div class="book__image"></div>
        <p class="book__title"></p>`);

    book.querySelector(".book__image").style.backgroundImage = `url(${ image })`;
    book.querySelector(".book__title").textContent = title;
    
}

function getBooksData() {
    fetch ('http://5d22b7fd4e05c600146ef4dd.mockapi.io/cupcake/books')
        .then (res => {
            if (res.ok) return res.json();
                        return Promise.reject( `Ошибка: ${ res.status }` );  
        })

        .then (json => json.books.forEach(item => {
            createBook( item.image, item.title );
            console.log( item );
        }))
        .catch(err => console.log( err ));
}

getBooksData();