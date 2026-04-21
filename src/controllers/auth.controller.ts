import type { Request, Response, NextFunction } from 'express';
import type AuthService from '../services/auth.service.js';

export default class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}
