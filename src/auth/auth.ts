import axios from 'axios';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { Request, Response } from 'express';
import User from '../models/user.js';

export const redirectToGoogle = (req: Request, res: Response): void => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL!,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const queryString = new URLSearchParams(options).toString();

  return res.redirect(`${rootUrl}?${queryString}`);
};

export const googleCallback = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).send('Authorization code not provided.');
  }

  try {
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL!,
        grant_type: 'authorization_code',
      })
    );

    const { id_token, access_token } = tokenResponse.data;

    const googleUserResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    const {
      id,
      email,
      name,
      picture,
    }: {
      id: string;
      email: string;
      name: string;
      picture: string;
    } = googleUserResponse.data;

    let user = await User.findOne({
      providerId: id,
      provider: 'google',
    });

    if (!user) {
      user = await User.create({
        email,
        name,
        avatar: picture,
        provider: 'google',
        providerId: id,
      });
    }

    const appToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.cookie('token', appToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${process.env.FRONTEND_URL}/`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('OAuth Error:', error.response?.data ?? error.message);
    } else {
      console.error(error);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

interface DecodedToken extends JwtPayload {
  userId: string;
}

export const verifyUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      isAuthenticated: false,
      message: 'No token found',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    const user = await User.findById(decoded.userId).select('-providerId');

    if (!user) {
      res.status(401).json({
        isAuthenticated: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      isAuthenticated: true,
      user,
    });
  } catch (error) {
    res.status(401).json({
      isAuthenticated: false,
      message: 'Invalid or expired token',
    });
  }
};

export const logoutUser = (req: Request, res: Response): void => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
