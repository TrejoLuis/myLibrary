const newBook = document.querySelector('#new-book')
const closeFormButton = document.querySelectorAll('.close-form')
const bookForm = document.querySelector('#book-form')
const editForm = document.querySelector('#edit-form')
const bookContainer = document.querySelector('.book-container')
const overlayPopUp = document.querySelector('.overlay-popUp')


newBook.addEventListener('click', popUpHandler)

closeFormButton.forEach(btn => addEventListener('click', popUpHandler))

bookForm.addEventListener('submit', addBook)

editForm.addEventListener('submit', editBook)

let myLibrary = []
let currentBook = ''

class Book {
  constructor(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = Number(pages)
    this.read = read
  }
}

myLibrary.push(new Book('1984', 'George Orwell', 328, false))
myLibrary.push(new Book('The Hobbit', 'J.R.R. Tolkien', 310, true))
myLibrary.push(new Book('Dracula', 'Bram Stoker', 431, true))
myLibrary.push(new Book('The Martian', 'Andy Weir', 387, true))

function popUpHandler(e) {
  //Handles new book form, and its close button, edit form and its close button
  if (e.target.id === 'new-book') {
    overlayPopUp.style.display = 'block'
    bookForm.style.display = 'flex'
  } else if (e.target.title === 'edit') {
    overlayPopUp.style.display = 'block'
    editForm.style.display = 'flex'

    const cardNodes = e.target.parentNode.parentNode.childNodes
    document.querySelector('#editTitle').value = cardNodes[0].textContent
    document.querySelector('#editAuthor').value = cardNodes[1].textContent
    document.querySelector('#editPages').value = cardNodes[2].textContent

    myLibrary.forEach(b => {
      if (b.title === cardNodes[0].textContent) currentBook = b
    })
  } else if (e.target.classList[0] === 'close-form' || (e.type === 'submit' && (e.target.id === 'book-form' || e.target.id === 'edit-form'))) {
    overlayPopUp.style.display = 'none'
    bookForm.style.display = 'none'
    editForm.style.display = 'none'
    bookForm.reset()
  }
}

function addBook(e) {
  e.preventDefault()
  //Validate duplicate title
  const titles = myLibrary.length > 0 ? myLibrary.map(b => b.title) : '-'
  if (titles.includes(document.querySelector('#addTitle').value)) {
    document.querySelector('#addTitle').value = ''
    alert('Title already registered')
  } else {
    const title = document.querySelector('#addTitle').value
    const author = document.querySelector('#addAuthor').value
    const pages = document.querySelector('#addPages').value
    const read = document.querySelector('#read').checked

    myLibrary.push(new Book(title, author, pages, read))

    popUpHandler(e)
    createBookCard(myLibrary[myLibrary.length - 1])
  }
}

function createBookCard(book) {
  currentBook = book
  const card = document.createElement('div')
  card.classList.add('book-card')

  const pTitle = document.createElement('p')
  pTitle.textContent = book.title

  const pAuthor = document.createElement('p')
  pAuthor.textContent = book.author

  const pPages = document.createElement('p')
  pPages.textContent = book.pages

  const pRead = document.createElement('p')

  const toggleRead = document.createElement('input')
  toggleRead.type = 'checkbox'
  toggleRead.classList.add('toggle')
  toggleRead.id = `tgl${book.title}`
  toggleRead.checked = book.read
  toggleRead.addEventListener('click', toggleReadHandler)

  const labelRead = document.createElement('label')
  labelRead.setAttribute('for', `tgl${book.title}`)
  labelRead.textContent = book.read === true ? 'Read' : 'Not yet'
  pRead.append(toggleRead, labelRead)

  const divMenu = document.createElement('div')
  divMenu.classList.add('book-card-menu')
  const imgDel = document.createElement('img')
  // imgDel.src = './images/delete40.png'
  imgDel.src = './images/trash-outline.svg'
  imgDel.addEventListener('click', deleteCard)

  const imgEdit = document.createElement('img')
  // imgEdit.src = './images/edit40.png'
  imgEdit.src = './images/pencil-outline.svg'
  imgEdit.title = 'edit'
  imgEdit.addEventListener('click', popUpHandler)
  divMenu.append(imgDel, imgEdit)

  card.append(pTitle, pAuthor, pPages, pRead, divMenu)

  bookContainer.appendChild(card)
}

function deleteCard(e) {
  const card = e.target.parentNode.parentNode
  const title = card.firstChild.textContent

  //Delete book from library
  myLibrary = myLibrary.filter(b => b.title !== title)
  //Delete card
  document.querySelector('.book-container').removeChild(card)
}

function editBook(e) {
  e.preventDefault()

  const cardNodes = document.querySelectorAll('.book-card')
  let currentCard = ''
  cardNodes.forEach(bc => {
    if (bc.firstChild.textContent === currentBook.title) currentCard = bc
  })

  //Validate duplicate title
  const titles = myLibrary.length > 0
    ? myLibrary.map(b => {
      if (b.title !== currentCard.firstChild.textContent)
        return b.title
    })
    : '-'
  if (titles.includes(document.querySelector('#editTitle').value)) {
    alert('Title already registered')
  } else {

    //Setting new values Card and Book
    currentBook.title = document.querySelector('#editTitle').value
    currentBook.author = document.querySelector('#editAuthor').value
    currentBook.pages = document.querySelector('#editPages').value

    currentCard.childNodes[0].textContent = currentBook.title
    currentCard.childNodes[1].textContent = currentBook.author
    currentCard.childNodes[2].textContent = currentBook.pages

    popUpHandler(e)
  }
}

function toggleReadHandler(e) {

  const currentCard = e.target.parentNode.parentNode.childNodes
  myLibrary.forEach(b => {
    if (b.title === currentCard[0].textContent) currentBook = b
  })
  if (!currentBook.read) {
    currentCard[3].firstChild.checked = true
    currentCard[3].lastChild.textContent = 'Read'
    currentBook.read = true
  } else {
    currentCard[3].firstChild.checked = false
    currentCard[3].lastChild.textContent = 'Not yet'
    currentBook.read = false
  }
}

function renderCards() {
  if (myLibrary.length > 0) {
    myLibrary.forEach(book => createBookCard(book))
  }
}

renderCards()