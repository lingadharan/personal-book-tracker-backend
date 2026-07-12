import { Router } from 'express';
import BookController from '../controller/bookcontroller.js';
import UserController from '../controller/userController.js';
import {
  googleCallback,
  logoutUser,
  redirectToGoogle,
  verifyUser,
} from '../auth/auth.js';

const router = Router();
const bookController = new BookController();
const userController = new UserController();

// Book
router.get('/', (req, res) => bookController.getBookDetails(req, res));
router.post('/add-book', (req, res) =>
  bookController.createBookDetails(req, res)
);
router.put('/update-book', (req, res) =>
  bookController.updateBookDetails(req, res)
);
router.delete('/delete-book', (req, res) =>
  bookController.deleteBookDetails(req, res)
);

router.get('/auth/google', (req, res) => redirectToGoogle(req, res));
router.get('/auth/google/callback', (req, res) => googleCallback(req, res));

router.get('/auth/me', (req, res) => verifyUser(req, res));

router.post('/auth/logout', (req, res) => logoutUser(req, res));

export default router;
