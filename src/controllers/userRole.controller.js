export default class UserRoleController {
  constructor(userRoleService) {
    this.userRoleService = userRoleService;
  }

  assign = async (req, res, next) => {
    try {
      const { userId, roleId } = req.body;
      res.status(201).json(await this.userRoleService.assign(userId, roleId));
    } catch (err) {
      next(err);
    }
  };

  revoke = async (req, res, next) => {
    try {
      await this.userRoleService.revoke(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  getByUser = async (req, res, next) => {
    try {
      res.json(await this.userRoleService.getByUser(req.params.userId));
    } catch (err) {
      next(err);
    }
  };
}
