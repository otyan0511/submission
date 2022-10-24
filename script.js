const buku = [];
const RENDER_EVENT = 'render_listBook';
const SAVED_EVENT = 'saved-listBook';
const SEARCH_EVENT = 'search-listBook';
const STORAGE_KEY = 'Bookshelf_APPS';
let cariBuku = [];

function buatID() {
    return +new Date();
}

function buatListBook(id, title, author, year, isComplete){
    return {
        id,
        title,
        author,
        year,
        isComplete,
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
    const {id, title, author, year, isComplete} = listBookObject;

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

    if(!isComplete){
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
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const textbuatID = buatID();
    const listBookObject = buatListBook(textbuatID, textTitle, textAuthor, textTahun, isCompleted);
    buku.push(listBookObject);
    console.log(buku);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
}

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    if(isStorageExist()){
        loadDataLocal();
    }
    submitForm.addEventListener('submit', function(even){
        even.preventDefault();
        addBook();
    });
});

document.addEventListener(RENDER_EVENT, function(){
    const inCompletedBook = document.getElementById('incompleteBookshelfList');
    const completedBook = document.getElementById('completeBookshelfList');
    const textCari = document.getElementById('searchBookTitle');
    
    inCompletedBook.innerHTML = '';
    completedBook.innerHTML = '';
    textCari.value = '';

    for (const listBook of buku){
        const listBookElement = tambahListBook(listBook);
        if (listBook.isComplete){
            completedBook.append(listBookElement)
        } else {
            inCompletedBook.append(listBookElement)
        }
    }
});

document.getElementById('inputBookIsComplete').addEventListener('click', function(){
    const centang = document.getElementById('inputBookIsComplete').checked;
    const textButton = document.getElementById('bookSubmit');
    if (centang){ 
        textButton.innerHTML = "Masukkan Buku ke rak <span>Selesai dibaca</span>" 
    } else {
        textButton.innerHTML = "Masukkan Buku ke rak <span>Belum selesai dibaca</span>" 
    }
});

function addToAlreadyRead(bookID){
    const bookTarget = cekListBook(bookID);
    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    console.log(bookTarget);
    saveBook();
}

function undoAlreadyRead(bookID){
    const bookTarget = cekListBook(bookID);
    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    console.log(bookTarget);
    saveBook();
}

function removeBook(bookID){
    const bookTarget = cekListBookIndex(bookID);
    const bookTargetData = cekListBook(bookID);
    console.log(bookTargetData);
    if(confirm("Buku berjudul "+bookTargetData.title+" karya "+bookTargetData.author+" akan dihapus ?" )){
        if (bookTarget === -1) return;
        buku.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveBook();
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        return false;
    } else {
        return true;
    }
}

document.addEventListener(SAVED_EVENT, function () {
    //  alert('Data Berhasil Disimpan !')
  });

function saveBook() {
    if(isStorageExist){
        const save = JSON.stringify(buku);
        localStorage.setItem(STORAGE_KEY, save);
        document.dispatchEvent(new Event(SAVED_EVENT));

    }
}

function loadDataLocal() {
    const localData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(localData);

    if (data !== null) {
        for (const data_ of data){
            buku.push(data_);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.getElementById('searchBook').addEventListener('submit', function(even){
    const textCari = document.getElementById('searchBookTitle').value;
    findBook(textCari);
    even.preventDefault();
});

function findBook(kata){
    cariBuku = [];
    for (const cari of buku){
        if (cari.title == kata || cari.author == kata || cari.year == kata){
            cariBuku.push(cari);
        }
    }
    document.dispatchEvent(new Event(SEARCH_EVENT));
}

document.addEventListener(SEARCH_EVENT, function(){
    const inCompletedBook = document.getElementById('incompleteBookshelfList');
    const completedBook = document.getElementById('completeBookshelfList');
    
    inCompletedBook.innerHTML = '';
    completedBook.innerHTML = ''

    for (const listBook of cariBuku){
        const listBookElement = tambahListBook(listBook);
        if (listBook.isComplete){
            completedBook.append(listBookElement)
        } else {
            inCompletedBook.append(listBookElement)
        }
    }
});
