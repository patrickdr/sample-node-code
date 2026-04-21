import type { Request, Response, NextFunction } from 'express';
import type UserService from '../services/user.service.js';
import type { CreateUserDto, UpdateUserDto } from '../types/dto.js';

export default class UserController {
  constructor(private userService: UserService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.userService.getAll());
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.userService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json(await this.userService.create(req.body as CreateUserDto));
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.userService.update(req.params.id, req.body as UpdateUserDto));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
