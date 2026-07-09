import BookRepository from '../repository/bookRepository.js';

export default class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  async createBookDetails(books: any[]): Promise<any> {
    try {
      return await this.bookRepository.createBooks(books);
    } catch (error) {
      console.error('Error in BookService.createBookDetails:', error);
      throw error;
    }
  }

  async getBookDetails(id?: string): Promise<any> {
    try {
      if (id) {
        return await this.bookRepository.getBookById(id);
      }
      return await this.bookRepository.getAllBooks();
    } catch (error) {
      console.error('Error in BookService.getBookDetails:', error);
      throw error;
    }
  }

  async updateBookDetails(id: string, updateData: any): Promise<any> {
    try {
      return await this.bookRepository.updateBook(id, updateData);
    } catch (error) {
      console.error('Error in BookService.updateBookDetails:', error);
      throw error;
    }
  }

  async deleteBookDetails(id: string): Promise<any> {
    try {
      return await this.bookRepository.deleteBook(id);
    } catch (error) {
      console.error('Error in BookService.deleteBookDetails:', error);
      throw error;
    }
  }
}
