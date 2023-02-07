// token bor-yo'qligini tekshirish
let tokenLS = localStorage.getItem("token");
if (!tokenLS) {
  location.replace('../index.html');
};

// LSdan kitoblarni olish ----------------------------------
let booksLS = JSON.parse(localStorage.getItem("books")) || [];

// logout - chiqib ketish -----------------------------------
const logout = document.querySelector('.header__top-logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  let question = confirm("You really want to go out?");
  if (question) {
    localStorage.removeItem("token");
    localStorage.removeItem("books");
    location.replace('../index.html');
  }
});

// search ---------------------------------------------------
const search = document.querySelector('.header__top-search');
const countResult = document.querySelector('.header__bottom-span');
const serchForm = document.querySelector('.header__top-form');

// oxirgi qidirilgan kitob nomi
let indexPage;
let orderNew;

// search formasini sumbit qilish
serchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let value = search.value;
  getData(value);
  indexPage = value;
  orderNew = 'relevance';
  search.value = '';
});

const teaser = document.querySelector('.main__content-teaser');
const teaserText = document.querySelector('.main__content-teaser-text');
const cardBox = document.querySelector('.main__content');

// datadan kitoblarri arreyini olish
async function getData(bookName = 'java', startIndex = 1, order = 'relevance') {
  try {
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookName}&startIndex=${Number(startIndex)}&maxResults=6&orderBy=${order}`);
    let data = await response.json();
    if (data.totalItems === 0) {
      cardBox.innerHTML = '';
      cardBox.textContent = `Book title '${bookName}' not found`;
      pagination.style.display = 'none';
      return;
    }

    cardBox.innerHTML = '';
    data.items.forEach(item => {
      let id = item.id;
      let img = item.volumeInfo.imageLinks.thumbnail || item.volumeInfo.imageLinks.smallThumbnail;
      let title = item.volumeInfo.title;
      let author = item.volumeInfo.authors[0];
      let year = item.volumeInfo.publishedDate.slice(0, 4);

      createCards(id, img, title, author, year);
    });
    countResult.textContent = data.totalItems;
    createPaginations(Number(data.totalItems));

  } catch (e) {
    cardBox.innerHTML = '';
    cardBox.textContent = `'${bookName}' - book not found. API error`;
    pagination.style.display = 'none';
  }
};

//bitta dona card yaratish
function createCards(bookId, bookImg, bookTitle, bookAuthor, bookYear) {
  const fragment = document.createDocumentFragment();

  const card = document.createElement('div');
  card.classList.add('main__card');
  card.setAttribute("id", bookId);

  const cardImgBox = document.createElement('div');
  cardImgBox.classList.add('main__card-imgBox');

  const cardImg = document.createElement('img');
  cardImg.classList.add('main__card-img');
  cardImg.setAttribute("src", bookImg);
  cardImg.setAttribute("alt", "Card image");

  cardImgBox.appendChild(cardImg);

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('main__card-title');
  cardTitle.textContent = bookTitle;

  const cardAuthor = document.createElement('p');
  cardAuthor.classList.add('main__card-author');
  cardAuthor.textContent = bookAuthor;

  const cardYear = document.createElement('p');
  cardYear.classList.add('main__card-author');
  cardYear.textContent = bookYear;

  const cardButtons = document.createElement('div');
  cardButtons.classList.add('main__card-buttons');

  const cardBookmark = document.createElement('button');
  cardBookmark.classList.add('main__card-btn', 'cardBookmark');
  cardBookmark.textContent = `Bookmark`;

  const cardInfo = document.createElement('button');
  cardInfo.classList.add('main__card-btn', 'cardInfo');
  cardInfo.textContent = `More Info`;

  cardButtons.appendChild(cardBookmark);
  cardButtons.appendChild(cardInfo);

  const cardRead = document.createElement('a');
  cardRead.setAttribute("target", "_blank");
  cardRead.setAttribute("href", "#!");
  cardRead.classList.add('main__card-readBtn');
  cardRead.textContent = `Read`;


  card.appendChild(cardImgBox);
  card.appendChild(cardTitle);
  card.appendChild(cardAuthor);
  card.appendChild(cardYear);
  card.appendChild(cardButtons);
  card.appendChild(cardRead);
  fragment.appendChild(card);
  cardBox.appendChild(fragment);
};

const orderBtn = document.querySelector('.header__bottom-sort');

// order knopka bosilishi
orderBtn.addEventListener('click', (e) => {
  if (!indexPage) {
    cardBox.innerHTML = '';
    cardBox.textContent = `First you need to do a book search`;
    return;
  };
  orderNew = 'newest';
  getData(indexPage, 0, 'newest');
});

const pagination = document.querySelector('.pagination');
const paginationBox = document.querySelector('.pagination__content');
const paginationPage = document.querySelector('.pagination__content-pages');
const prewLi = document.querySelector('.pagination__prewLi');
const nextLi = document.querySelector('.pagination__nextLi');

let pageNumber

// pagination pagelar yasash
function createPaginations() {
  let counter = Math.ceil(40 / 6);
  paginationPage.innerHTML = '';
  for (let i = 1; i < (counter + 1); i++) {
    const li = document.createElement('li');
    li.classList.add('pagination__content-li', `id${i}`);
    li.setAttribute("id", i);
    li.textContent = i;
    paginationPage.appendChild(li);
  }
  pagination.style.display = 'block';
};

//pagenation knopka bosilganda nomerini olish
paginationPage.addEventListener('click', (e) => {
  let pageNum = e.target.id;
  pageNumber = +pageNum;
  getData(indexPage, pageNum*6, orderNew);
});

//prew page
prewLi.addEventListener('click', () => {
  if(pageNumber <= 1) {
    return;
  }
  pageNumber--;
  console.log(pageNumber);
  getData(indexPage, pageNumber*6, orderNew);
});
// next page
nextLi.addEventListener('click', () => {
  if(pageNumber >= 7) {
    return;
  }
  pageNumber++;
  console.log(pageNumber);
  getData(indexPage, pageNumber, orderNew);
});

// Sidebar o'zgartirish-----------------------------------------
const sidebar = document.querySelector('.sidebar');
const sidebarContent = sidebar.querySelector('.sidebar__content');
const sidebarClose = sidebar.querySelector('.sidebar__content-close');
const sidebarTitile = sidebar.querySelector('.sidebar__content-title');
const sidebarImg = sidebar.querySelector('.sidebar__content-img');
const sidebarDescription = sidebar.querySelector('.sidebar__content-description');
const sidebarAuthors = sidebar.querySelector('.sidebarAuthor');
const sidebarPublished = sidebar.querySelector('.sidebarPublished');
const sidebarPublishers = sidebar.querySelector('.sidebarPublishers');
const sidebarCategories = sidebar.querySelector('.sidebarCategories');
const sidebarCounts = sidebar.querySelector('.sidebarCounts');
const sidebarRead = document.querySelector('.sidebar__content-btn');

// datadan bitta kitob haqida ma'lumot olish
async function getBook(id) {
  let response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
  let data = await response.json();
  return data;
};

// datadan ma'lumotlarni olib createSidebar() ga uzatish
async function editSidebar(id) {
  let data = await getBook(id);

  let bookTitle = data.volumeInfo.title;
  let bookImage = data.volumeInfo.imageLinks.smallThumbnail;
  let bookDescription = data.volumeInfo.description;
  let bookAuthors = data.volumeInfo.authors;
  let bookPublished = data.volumeInfo.publishedDate;
  let bookPublishers = data.volumeInfo.publisher;
  let bookCategories = data.volumeInfo.categories;
  let bookCounts = data.volumeInfo.pageCount;
  let readID = id;

  createSidebar(bookTitle, bookImage, bookDescription, bookAuthors, bookPublished, bookPublishers, bookCategories, bookCounts, readID);
};

// datadan linkni chiqarvolish
async function readLink(id) {
  let data = await getBook(id);
  let link = data.volumeInfo.previewLink;
  location.href = link;
};

// sidebardagi ma'lumotlarni o'zgartirish
function createSidebar(bookTitle, bookImage, bookDescription, bookAuthors, bookPublished, bookPublishers, bookCategories, bookCounts, readID) {
  document.body.style.overflow = 'hidden';

  sidebarTitile.textContent = bookTitle;
  sidebarImg.src = bookImage;
  sidebarDescription.innerHTML = bookDescription;
  sidebarAuthors.textContent = bookAuthors;
  sidebarPublished.textContent = bookPublished;
  sidebarPublishers.textContent = bookPublishers;
  sidebarCategories.textContent = bookCategories;
  sidebarCounts.textContent = bookCounts;
  sidebarRead.id = readID;

  sidebar.style.opacity = '1';
  sidebar.style.zIndex = '2';
  sidebarContent.style.right = '0';
};

// sidebarni yopish knopkasi bosilishi
sidebarClose.addEventListener('click', () => {
  sidebar.style.opacity = '0';
  sidebar.style.zIndex = '-5';
  sidebarContent.style.right = '-100%';
  document.body.style.overflow = 'auto';
  sidebarImg.src = "";
});

// carddagi more info/read/bookmark knopkalari bosilishi
cardBox.addEventListener('click', (e) => {
  if (e.target.classList.contains('cardInfo')) {
    let bookID = e.target.closest('.main__card').id;
    editSidebar(bookID);
  } else if (e.target.classList.contains('main__card-readBtn')) {
    let bookID = e.target.closest('.main__card').id;
    e.preventDefault();
    readLink(bookID);
  } else if (e.target.classList.contains('cardBookmark')) {
    let bookID = e.target.closest('.main__card').id;
    bookmarLocalStorage(bookID);
  };
});

// sidebardagi read knopkasi bosilishi
sidebar.addEventListener('click', (e) => {
  e.preventDefault();
  let link = e.target.id;
  readLink(link);
});

// Bookmark -------------------------------------------------
const bookmark = document.querySelector('.main__bookmark');


// bookmarkda bitta kitob yasash funksiyasi
function createBookmarkBook(bookTitle, bookAuthor, bookID) {
  const fragment = document.createDocumentFragment();

  const book = document.createElement('div');
  book.classList.add('main__bookmark-book');
  book.setAttribute("id", bookID);

  const bookInfo = document.createElement('div');
  bookInfo.classList.add('main__bookmark-info');

  const title = document.createElement('h2');
  title.classList.add('main__bookmark-title');
  title.textContent = `${bookTitle}...`;

  const author = document.createElement('p');
  author.classList.add('main__bookmark-author');
  author.textContent = bookAuthor;

  const buttons = document.createElement('div');
  buttons.classList.add('main__bookmark-buttons');

  const read = document.createElement('a');
  read.setAttribute("target", "_blank");
  read.setAttribute("href", "#!");
  read.classList.add('main__bookmark-btn');

  const readIcon = document.createElement('i');
  readIcon.classList.add('fa-solid', 'fa-book-open', 'readBookmark');

  read.appendChild(readIcon);

  const del = document.createElement('button');
  del.classList.add('main__bookmark-btn');

  const delIcon = document.createElement('i');
  delIcon.classList.add('fa-solid', 'fa-delete-left', 'deleteBookmark');

  del.appendChild(delIcon);


  bookInfo.appendChild(title);
  bookInfo.appendChild(author);

  buttons.appendChild(read);
  buttons.appendChild(del);

  book.appendChild(bookInfo);
  book.appendChild(buttons);
  fragment.appendChild(book);

  bookmark.appendChild(fragment);
};

// card-bookmark bosilganda bookmarkka kitob qo'shish
async function bookmarLocalStorage(id) {
  let book = await getBook(id);
  let resault = true;
  let booksLS = JSON.parse(localStorage.getItem("books")) || [];
  booksLS.forEach(item => {
    if (item.id === book.id) {
      resault = false
    };
  });

  if (resault) {
    booksLS.push(book);
  };

  localStorage.setItem("books", JSON.stringify(booksLS));

  bookmark.innerHTML = '';
  booksLS.forEach(item => {
    let bookTitle = item.volumeInfo.title.slice(0, 15);
    let bookAuthor = item.volumeInfo.authors;
    let bookID = id;

    createBookmarkBook(bookTitle, bookAuthor, bookID);
  });
};

// LSdagi kitoblarri bookmargga chiqarish
booksLS.forEach(item => {
  let bookTitle = item.volumeInfo.title.slice(0, 15);
  let bookAuthor = item.volumeInfo.authors;
  let bookID = item.id;

  createBookmarkBook(bookTitle, bookAuthor, bookID);
});

// bookmark read knopkasi bosilishi
bookmark.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.classList.contains('readBookmark')) {
    let bookID = e.target.closest('.main__bookmark-book').id;
    readLink(bookID);
  } else if (e.target.classList.contains('deleteBookmark')) {
    let bookID = e.target.closest('.main__bookmark-book').id;
    let booksLS = JSON.parse(localStorage.getItem("books"));
    let newBooks = booksLS.filter(item => item.id !== bookID);

    localStorage.setItem('books', JSON.stringify(newBooks));

    bookmark.innerHTML = '';
    newBooks.forEach(item => {
      let bookTitle = item.volumeInfo.title.slice(0, 15);
      let bookAuthor = item.volumeInfo.authors;
      let bookID = item.id;

      createBookmarkBook(bookTitle, bookAuthor, bookID)
    });
  };
});


const bookmarkBox = document.querySelector('.main__bookmarkBox');
const bookmarkOpen = document.querySelector('.bookmarkOpen');
const bookmarkClose = document.querySelector('.main__bookmarkBox-close');

//bookmark ni chiqarish
bookmarkOpen.addEventListener('click', () => {
  bookmarkBox.style.display = 'block';
});

//bookmark ni kirgazish
bookmarkClose.addEventListener('click', () => {
  bookmarkBox.style.display = 'none';
});

// theme ------------------------------------------
const themeArr = {
  light: {
    '--NSM500': 'NSM500',
    '--RM500': 'RM500',
    '--RR400': 'RR400',
    '--dark': 'white',
    '--light': 'black',
    '--seriy': '#222531',
    '--mainBg': '#E5E5E5',
    '--card': '#F8FAFD',
    '--cards': 'white',
    '--cardAuthor': '#757881',
    '--cardInfo': '#0d75ff0d',
    '--sideHeader': '#F8FAFD',
    '--sideText': '#58667E',
    '--sideAuthor': '#0D75FF',
  },
  dark: {
    '--NSM500': 'NSM500',
    '--RM500': 'RM500',
    '--RR400': 'RR400',
    '--dark': 'black',
    '--light': 'white',
    '--seriy': 'rgb(226, 220, 220)',
    '--mainBg': '#271e1e',
    '--card': '#362a2a',
    '--cards': '#575353',
    '--cardAuthor': '#ddd9d9',
    '--cardInfo': '#828183',
    '--sideHeader': '#4d4141',
    '--sideText': 'white',
    '--sideAuthor': 'black',
  }
};
const themeIcon = document.querySelectorAll('.header__top-theme');
const logo = document.querySelector('.header__top-logo');
const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');
// temani o'zgartirish
themeIcon.forEach(item => {
  item.addEventListener('click', (e) => {
    if (e.target.classList.contains('sun')) {
      let selectedTheme = themeArr.light;
      Object.entries(selectedTheme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      logo.src = `../images/logo_color.svg`;
      sun.style.display = 'none';
      moon.style.display = 'block';
    } else if (e.target.classList.contains('moon')) {
      let selectedTheme = themeArr.dark;
      Object.entries(selectedTheme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      logo.src = `../images/logo.svg`;
      moon.style.display = 'none';
      sun.style.display = 'block';
    };
  });
});