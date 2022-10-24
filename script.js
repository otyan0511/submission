const buku = [];
const RENDER_EVENT = 'render_listBook';

function buatID() {
    return +new Date();
}

function buatListBook(id, title, author, year, isCompleted){
    let status;
    if(isCompleted == 'on'){status = true} else {status = false}
    return {
        id,
        title,
        author,
        year,
        status,
    }
}

function cekListBook(idBuku){
    for (const listBook of buku){
        if(listBook.id == idBuku){
            return listBook;
        }
    }
    return null;
}
function cekListBookIndex(idBuku) {
    for (const index in buku){
        if(buku[index].id === idBuku){
            return index;
        }
    }
    return -1;
}

function tambahListBook(listBookObject){
   // return listBookObject;
    const {id, title, author, year, isCompleted} = listBookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis: '+author;

    const textTahun = document.createElement('p');
    textTahun.innerText = 'Tahun: '+year;    

    const buttonBox = document.createElement('div');
    buttonBox.classList.add('action');

    const selesaiButton = document.createElement('button');
    selesaiButton.classList.add('green');

    if(!isCompleted){
    selesaiButton.innerText = 'Selesai dibaca';
    selesaiButton.addEventListener('click', function(){
        addToAlreadyRead(id);
    });
    } else {
        selesaiButton.innerText = 'Belum Selesai dibaca';
        selesaiButton.addEventListener('click', function(){
        undoAlreadyRead(id);
        });
    }


    const hapusButton = document.createElement('button');
    hapusButton.classList.add('red');
    hapusButton.innerText = 'Hapus buku';   
    hapusButton.addEventListener('click', function(){
        removeBook(id)
    });
    buttonBox.append(selesaiButton, hapusButton);
    const divArticle = document.createElement('article');
    divArticle.classList.add('book_item');
    divArticle.append(textTitle, textAuthor, textTahun, buttonBox);
    divArticle.setAttribute('id', `buku-${id}`);


    return divArticle;
}


function addBook() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textTahun = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').value;

    const textbuatID = buatID();
    const listBookObject = buatListBook(textbuatID, textTitle, textAuthor, textTahun, isCompleted);
    buku.push(listBookObject);
    console.log(buku);
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');

    //
    submitForm.addEventListener('submit', function(even){
        even.preventDefault();
        addBook();
    });
});

document.addEventListener(RENDER_EVENT, function(){
    const inCompletedBook = document.getElementById('incompleteBookshelfList');
    //

    inCompletedBook.innerHTML = '';

    for (const listBook of buku){
        const listBookElement = tambahListBook(listBook);
        inCompletedBook.append(listBookElement)
    }
});