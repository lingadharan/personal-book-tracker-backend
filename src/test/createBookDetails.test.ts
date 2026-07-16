import { beforeEach, describe, expect, it, vi } from 'vitest';
import httpMocks from 'node-mocks-http';
import type { Request, Response } from 'express';
import BookController from '../controller/bookcontroller.js';
import BookService from '../service/bookService.js';

vi.mock('@/services/bookService');

describe('BookController - createBookDetails', () => {
  let controller: BookController;

  beforeEach(() => {
    controller = new BookController();
    vi.clearAllMocks();
  });

  const validBook = {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'reading',
    currentPage: 120,
    notes: 'Very good book',
  };

  it('returns 400 when books array is missing', async () => {
    const req = httpMocks.createRequest<Request>({
      method: 'POST',
      body: {},
    });

    const res = httpMocks.createResponse<Response>();

    await controller.createBookDetails(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Invalid or missing books array',
    });
  });

  it('returns 400 when books array is empty', async () => {
    const req = httpMocks.createRequest<Request>({
      method: 'POST',
      body: {
        books: [],
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.createBookDetails(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Invalid or missing books array',
    });
  });

  it('returns 400 when validation fails', async () => {
    const req = httpMocks.createRequest<Request>({
      method: 'POST',
      body: {
        books: [
          {
            author: 'James Clear',
            category: 'reading',
          },
        ],
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.createBookDetails(req, res);

    expect(res.statusCode).toBe(400);

    expect(res._getJSONData()).toEqual({
      success: false,
      message:
        'Validation failed: title is required and must be a non-empty string',
    });
  });

  it('creates books successfully', async () => {
    vi.spyOn(BookService.prototype, 'createBookDetails').mockResolvedValue([
      {
        _id: '1',
        ...validBook,
      },
    ]);

    const req = httpMocks.createRequest<Request>({
      method: 'POST',
      body: {
        books: [validBook],
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.createBookDetails(req, res);

    expect(BookService.prototype.createBookDetails).toHaveBeenCalledWith([
      validBook,
    ]);

    expect(res.statusCode).toBe(201);

    expect(res._getJSONData()).toEqual({
      success: true,
      data: [
        {
          _id: '1',
          ...validBook,
        },
      ],
    });
  });

  it('returns 500 when service throws an error', async () => {
    vi.spyOn(BookService.prototype, 'createBookDetails').mockRejectedValue(
      new Error('Database Error')
    );

    const req = httpMocks.createRequest<Request>({
      method: 'POST',
      body: {
        books: [validBook],
      },
    });

    const res = httpMocks.createResponse<Response>();

    await controller.createBookDetails(req, res);

    expect(res.statusCode).toBe(500);

    expect(res._getJSONData()).toEqual({
      status: 500,
      error: 'Database Error',
    });
  });
});
