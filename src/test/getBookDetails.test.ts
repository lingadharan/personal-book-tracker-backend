import { beforeEach, describe, expect, it, vi } from 'vitest';
import httpMocks from 'node-mocks-http';
import type { Request, Response } from 'express';
import BookController from '../controller/bookcontroller.js';
import BookService from '../service/bookService.js';

vi.mock('@/services/bookService');

describe('BookController - getBookDetails', () => {
  let controller: BookController;

  beforeEach(() => {
    controller = new BookController();
    vi.clearAllMocks();
  });

  it('returns all books successfully', async () => {
    const books = [
      {
        _id: '1',
        title: 'Atomic Habits',
      },
      {
        _id: '2',
        title: 'Deep Work',
      },
    ];

    vi.spyOn(BookService.prototype, 'getBookDetails').mockResolvedValue(books);

    const req = httpMocks.createRequest<Request>({
      method: 'GET',
      query: {},
    });

    const res = httpMocks.createResponse<Response>();

    await controller.getBookDetails(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      count: 2,
      data: books,
    });
  });

  it('returns one book successfully', async () => {
    const book = {
      _id: '1',
      title: 'Atomic Habits',
    };

    vi.spyOn(BookService.prototype, 'getBookDetails').mockResolvedValue(book);

    const req = httpMocks.createRequest<Request>({
      method: 'GET',
      query: {
        _id: '1',
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.getBookDetails(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      data: book,
    });
  });

  it('returns 404 when book is not found', async () => {
    vi.spyOn(BookService.prototype, 'getBookDetails').mockResolvedValue(null);

    const req = httpMocks.createRequest<Request>({
      method: 'GET',
      query: {
        _id: '1',
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.getBookDetails(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Book not found',
    });
  });

  it('returns 404 for invalid ObjectId (CastError)', async () => {
    vi.spyOn(BookService.prototype, 'getBookDetails').mockRejectedValue({
      name: 'CastError',
    });

    const req = httpMocks.createRequest<Request>({
      method: 'GET',
      query: {
        _id: 'invalid-id',
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.getBookDetails(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Book not found',
    });
  });

  it('returns 500 when an unexpected error occurs', async () => {
    vi.spyOn(BookService.prototype, 'getBookDetails').mockRejectedValue(
      new Error('Database connection failed')
    );

    const req = httpMocks.createRequest<Request>({
      method: 'GET',
      query: {},
    });

    const res = httpMocks.createResponse<Response>();

    await controller.getBookDetails(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Failed to fetch books',
      error: 'Database connection failed',
    });
  });
});
