import type { Request, Response, NextFunction } from 'express';
import type UserRoleService from '../services/userRole.service.js';

export default class UserRoleController {
  constructor(private userRoleService: UserRoleService) {}

  assign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, roleId } = req.body as { userId: string; roleId: string };
      res.status(201).json(await this.userRoleService.assign(userId, roleId));
    } catch (err) {
      next(err);
    }
  };

  revoke = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userRoleService.revoke(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  getByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.userRoleService.getByUser(req.params.userId));
    } catch (err) {
      next(err);
    }
  };
}
