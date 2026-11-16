const { default: z } = require("zod");
const ApiResponse = require("../utils/ApiResponse");
const { Op } = require("sequelize");

class BaseController {
  constructor(Model, createSchema, readSchema, updateSchema, moduleName) {
    this.Model = Model;
    this.createSchema = createSchema;
    this.readSchema = readSchema;
    this.updateSchema = updateSchema;
    this.moduleName = moduleName;
  }
  All = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
      const result = await this.Model.findAndCountAll({ limit, offset });
      if (!result) return ApiResponse.notFound(res);
      return ApiResponse.ok(res, {
        total: result.count,
        pages: Math.ceil(result.count / limit),
        currentPage: page,
        items: result.rows,
      });
    } catch (err) {
      return next(err);
    }
  };

  getById = async (req, res, next) => {
    const { id } = req.body;
    if (!z.string().uuid().safeParse(id).success)
      return ApiResponse.badRequest(res, "invalid id format");

    try {
      const item = await this.Model.findByPk(id);

      if (!item) return ApiResponse.notFound(res);

      return ApiResponse.ok(res, item);
    } catch (err) {
      return next(err);
    }
  };

  Search = async (req, res, next) => {
    try {
      const filters = req.body;
      const whereClause = {};
      for (const [key, value] of Object.entries(filters)) {
        if (value && value !== "") {
          whereClause[key] = { [Op.like]: `%${value}%` };
        }
      }
      if (Object.keys(whereClause).length === 0) {
        return ApiResponse.badRequest(res, "No valid search parameters");
      }
      const result = await this.Model.findAll({ where: whereClause });
      return ApiResponse.ok(res, result);
    } catch (error) {
      return next(error);
    }
  };
  create = async (req, res, next) => {
    const parsed = this.createSchema.safeParse(req.body);
    if (!parsed.success)
      return ApiResponse.badRequest(
        res,
        parsed.error.errors,
        400,
        false,
        parsed.error,
      );
    try {
      const created = await this.Model.create(parsed.data);
      return ApiResponse.created(res, created);
    } catch (err) {
      return next(err);
    }
  };
  createMulti = async (req, res, next) => {
    try {
      const list = req.body;
      if (!Array.isArray(list) || list.length === 0) {
        return ApiResponse.badRequest(res, "Nothing provided");
      }
      const schema = z.array(this.createSchema);
      const parsed = schema.safeParse(list);
      if (!parsed.success)
        return ApiResponse.badRequest(res, parsed.error.errors);
      const createdList = await this.Model.bulkCreate(parsed.data, {
        validate: true,
      });
      return ApiResponse.success(
        res,
        createdList,
        "Multiple resources created",
        201,
      );
    } catch (err) {
      return next(err);
    }
  };
  update = async (req, res, next) => {
    const parsed = this.updateSchema.safeParse(req.body);
    if (!parsed.success)
      return ApiResponse.badRequest(res, parsed.error.errors);
    try {
      const [updated] = await this.Model.update(parsed.data, {
        where: { id: parsed.data.id },
      });
      if (!updated) return ApiResponse.notFound(res);
      const updatedItem = await this.Model.findByPk(parsed.data.id);
      return ApiResponse.ok(res, updatedItem);
    } catch (err) {
      return next(err);
    }
  };

  delete = async (req, res, next) => {
    const { id } = req.body;
    if (!z.string().uuid().safeParse(id).success)
      return ApiResponse.badRequest(res, "invalid id format");
    try {
      const deleted = await this.Model.destroy({ where: { id } });
      if (!deleted) return ApiResponse.notFound(res);
      return ApiResponse.ok(res, []);
    } catch (err) {
      return next(err);
    }
  };

  restore = async (req, res, next) => {
    const { id } = req.body;
    try {
      const restored = await this.Model.restore({ where: { id } });
      if (!restored) return ApiResponse.notFound(res);
      return ApiResponse.ok(res, []);
    } catch (err) {
      return next(err);
    }
  };

  destroy = async (req, res, next) => {
    const { id } = req.body;
    try {
      const deleted = await this.Model.destroy({ where: { id }, force: true });
      if (!deleted) return ApiResponse.notFound(res);
      return ApiResponse.ok(res);
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = BaseController;
