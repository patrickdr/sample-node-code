import type { Request, Response, NextFunction } from 'express';
import type RoleService from '../services/role.service.js';
import type { CreateRoleDto, UpdateRoleDto } from '../types/dto.js';

export default class RoleController {
  constructor(private roleService: RoleService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.roleService.getAll());
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.roleService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json(await this.roleService.create(req.body as CreateRoleDto));
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.roleService.update(req.params.id, req.body as UpdateRoleDto));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.roleService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
