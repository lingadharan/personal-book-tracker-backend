import { Router } from 'express';
import BookController from '../controller/bookcontroller.js';

const bookRouter = Router();
const bookController = new BookController();

bookRouter.get('/', (req, res) => bookController.getBookDetails(req, res));
bookRouter.post('/add-book', (req, res) => bookController.createBookDetails(req, res));
bookRouter.put('/update-book', (req, res) => bookController.updateBookDetails(req, res));
bookRouter.delete('/delete-book', (req, res) => bookController.deleteBookDetails(req, res));

export default bookRouter;
