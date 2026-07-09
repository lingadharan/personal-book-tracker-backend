import Book from '../models/book.js';

export default class BookRepository {
  async createBooks(books: any[]): Promise<any> {
    return await Book.insertMany(books);
  }

  async getBookById(id: string): Promise<any> {
    return await Book.findOne({ _id: id });
  }

  async getAllBooks(): Promise<any> {
    return await Book.find();
  }

  async updateBook(id: string, updateData: any): Promise<any> {
    return await Book.findOneAndUpdate(
      { _id: id },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
  }

  async deleteBook(id: string): Promise<any> {
    return await Book.findOneAndDelete({ _id: id });
  }
}
