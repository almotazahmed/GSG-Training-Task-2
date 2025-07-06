// IMPLEMENTATION

// ID generation
class IdGenerator {
  static #nextId = 1;
  
  static generate () {
    return IdGenerator.#nextId++;
  }
}

// Items Container
class ItemRepository{
  static #items = new Map();

  static save (item) {
    ItemRepository.#items.set(item.id, item)
  }
  
  static findById (id) {
    return ItemRepository.#items.get(id);
  }

  static removeById (id) {
    ItemRepository.#items.delete(id);
  }

  static clearItemRepo () {
    ItemRepository.#items.clear();
  }
}

// Base LibraryItem class
class LibraryItem {
  #id;
  #borrowHistory = [];
  constructor (title, type) {
    this.#id = IdGenerator.generate();
    this.title = title;
    this.isAvailable = true;
    this.type = type;

    ItemRepository.save(this);
  }

  get id () {return this.#id;}

  get borrowHistory() { return [...this.#borrowHistory]; }

  checkOut (borrower, dueDate = null) {
    if (!this.isAvailable)
    {
      throw new error("This Item Not Available!");
    }

    const borrowRecord = {
      borrower: borrower,
      checkOutDate: new Date(),
      dueDate: dueDate,
      isReturned: false
    }

    this.#borrowHistory.push(borrowRecord);
    this.isAvailable = false;
    return borrowRecord;
  }

  checkIn () {
    if (this.isAvailable)
    {
      throw new Error("This Item Is Already Available!");
    }
    let currentBorrow = this.#getCurrentBorrow();
    if (currentBorrow)
    {
      currentBorrow.isReturned = true;
      currentBorrow.returnDate = new Date();
    }
    this.isAvailable = true;
    return currentBorrow;
  }

  #getCurrentBorrow() {
    return this.#borrowHistory.find(record => !record.isReturned);
  }

  toString() {
    return `${this.title} type => ${this.type} - ${this.isAvailable ? 'Available' : 'Checked Out'}`;
  }
}

// Book class extending LibraryItem
class Book extends LibraryItem{
  #isbn;
  #publisher;
  #language;
  constructor (title, isbn, publisher, language, author) { 
    super(title, 'book');
    this.#isbn = isbn;
    this.#publisher = publisher;
    this.#language = language;
    this.author = author;
  }
  get isbn() { return this.#isbn; }
  get publisher () {return this.#publisher;}
  get language () {return this.#language;}

  set language(value) {
    this.#language = value;
  }

  toString() {
    return `"${this.title}" by ${this.author} (${this.type}) - ${this.isAvailable ? 'Available' : 'Checked Out'}`;
  }
}


// EXAMPLE USAGE
const book1 = new Book("The Great Gatsby", "978-0-7432-7356-5", "Scribner", "English", "F. Scott Fitzgerald");
console.log(book1.id)
console.log(book1.toString());
let dueDate = new Date();
dueDate.setDate(dueDate.getDate() + 13);
console.log(book1.checkOut("Motaz", dueDate));
console.log(book1.checkIn());
dueDate.setDate(dueDate.getDate() + 15);
console.log(book1.checkOut("Ahmed", dueDate));
// console.log(book1.checkIn());

console.log(book1.borrowHistory)