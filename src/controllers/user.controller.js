export default class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getAll = async (req, res, next) => {
    try {
      res.json(await this.userService.getAll());
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      res.json(await this.userService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      res.status(201).json(await this.userService.create(req.body));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      res.json(await this.userService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.userService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
