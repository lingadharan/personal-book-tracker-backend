import type { Request, Response } from 'express';
import Book from '../models/book.js';

export const createBookDetails = async (req: Request, res: Response) => {
  try {
    const result = await Book.insertMany(req.body.books)
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error
    })
  }
}

export const getBookDetails = async (req: Request, res: Response) => {
  try {
    const { _id } = req.query;

    if (_id) {
      const book = await Book.findOne({ _id: _id });

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: book,
      });
    }
    const books = await Book.find();

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error
    });
  }
}

export const updateBookDetails = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Book _id must be a number",
      });
    }

    const updatedBook = await Book.findOneAndUpdate(
      { _id: _id },
      req.body,
      {
        new: true,
        runVal_idators: true
      }
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedBook,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update book",
    });
  }
};

export const deleteBookDetails = async (req: Request, res: Response) => {
  try {
    const { _id } = req.query;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Book _id must be a number",
      });
    }

    const deletedBook = await Book.findOneAndDelete({ _id: _id });

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: deletedBook,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete book",
    });
  }
};

