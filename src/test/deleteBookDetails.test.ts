import { beforeEach, describe, expect, it, vi } from 'vitest';
import httpMocks from 'node-mocks-http';
import type { Request, Response } from 'express';
import BookController from '../controller/bookcontroller.js';
import BookService from '../service/bookService.js';

vi.mock('@/services/bookService');

describe('BookController - deleteBookDetails', () => {
  let controller: BookController;

  beforeEach(() => {
    controller = new BookController();
    vi.clearAllMocks();
  });

  const deletedBook = {
    _id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'reading',
  };

  it('returns 400 when _id is missing', async () => {
    const req = httpMocks.createRequest<Request>({
      method: 'DELETE',
      query: {},
    });

    const res = httpMocks.createResponse<Response>();

    await controller.deleteBookDetails(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Book _id must be a number',
    });
  });

  it('deletes the book successfully', async () => {
    vi.spyOn(BookService.prototype, 'deleteBookDetails').mockResolvedValue(
      deletedBook
    );

    const req = httpMocks.createRequest<Request>({
      method: 'DELETE',
      query: {
        _id: '1',
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.deleteBookDetails(req, res);

    expect(BookService.prototype.deleteBookDetails).toHaveBeenCalledWith('1');

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Book deleted successfully',
      data: deletedBook,
    });
  });

  it('returns 404 when book is not found', async () => {
    vi.spyOn(BookService.prototype, 'deleteBookDetails').mockResolvedValue(
      null
    );

    const req = httpMocks.createRequest<Request>({
      method: 'DELETE',
      query: {
        _id: '1',
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.deleteBookDetails(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Book not found',
    });
  });

  it('returns 404 for invalid ObjectId (CastError)', async () => {
    vi.spyOn(BookService.prototype, 'deleteBookDetails').mockRejectedValue({
      name: 'CastError',
    });

    const req = httpMocks.createRequest<Request>({
      method: 'DELETE',
      query: {
        _id: 'invalid-id',
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.deleteBookDetails(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Book not found',
    });
  });

  it('returns 500 when an unexpected error occurs', async () => {
    vi.spyOn(BookService.prototype, 'deleteBookDetails').mockRejectedValue(
      new Error('Database Error')
    );

    const req = httpMocks.createRequest<Request>({
      method: 'DELETE',
      query: {
        _id: '1',
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.deleteBookDetails(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Failed to delete book',
    });
  });
});
