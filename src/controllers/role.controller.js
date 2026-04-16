export default class RoleController {
  constructor(roleService) {
    this.roleService = roleService;
  }

  getAll = async (req, res, next) => {
    try {
      res.json(await this.roleService.getAll());
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      res.json(await this.roleService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      res.status(201).json(await this.roleService.create(req.body));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      res.json(await this.roleService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.roleService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
