import { beforeEach, describe, expect, it, vi } from 'vitest';
import httpMocks from 'node-mocks-http';
import type { Request, Response } from 'express';
import BookController from '../controller/bookcontroller.js';
import BookService from '../service/bookService.js';

vi.mock('@/services/bookService');

describe('BookController - updateBookDetails', () => {
  let controller: BookController;

  beforeEach(() => {
    controller = new BookController();
    vi.clearAllMocks();
  });

  const validBook = {
    _id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'reading',
    currentPage: 150,
    notes: 'Updated Notes',
  };

  it('returns 400 when _id is missing', async () => {
    const req = httpMocks.createRequest<Request>({
      method: 'PUT',
      body: {
        title: 'Atomic Habits',
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.updateBookDetails(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Book _id must be a number',
    });
  });

  it('returns 400 when validation fails', async () => {
    const req = httpMocks.createRequest<Request>({
      method: 'PUT',
      body: {
        _id: '1',
        title: '',
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.updateBookDetails(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      success: false,
      message:
        'Validation failed: title is required and must be a non-empty string',
    });
  });

  it('returns 404 when book is not found', async () => {
    vi.spyOn(BookService.prototype, 'updateBookDetails').mockResolvedValue(
      null
    );

    const req = httpMocks.createRequest<Request>({
      method: 'PUT',
      body: validBook,
    });

    const res = httpMocks.createResponse<Response>();

    await controller.updateBookDetails(req, res);

    expect(BookService.prototype.updateBookDetails).toHaveBeenCalledWith(
      '1',
      validBook
    );

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Book not found',
    });
  });

  it('updates the book successfully', async () => {
    vi.spyOn(BookService.prototype, 'updateBookDetails').mockResolvedValue(
      validBook
    );

    const req = httpMocks.createRequest<Request>({
      method: 'PUT',
      body: validBook,
    });

    const res = httpMocks.createResponse<Response>();

    await controller.updateBookDetails(req, res);

    expect(BookService.prototype.updateBookDetails).toHaveBeenCalledWith(
      '1',
      validBook
    );

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      data: validBook,
    });
  });

  it('returns 404 for invalid ObjectId (CastError)', async () => {
    vi.spyOn(BookService.prototype, 'updateBookDetails').mockRejectedValue({
      name: 'CastError',
    });

    const req = httpMocks.createRequest<Request>({
      method: 'PUT',
      body: validBook,
    });

    const res = httpMocks.createResponse<Response>();

    await controller.updateBookDetails(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Book not found',
    });
  });

  it('returns 500 when an unexpected error occurs', async () => {
    vi.spyOn(BookService.prototype, 'updateBookDetails').mockRejectedValue(
      new Error('Database Error')
    );

    const req = httpMocks.createRequest<Request>({
      method: 'PUT',
      body: validBook,
    });

    const res = httpMocks.createResponse<Response>();

    await controller.updateBookDetails(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Failed to update book',
    });
  });
});
