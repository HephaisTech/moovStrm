const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../configs/db/doa");
const { z } = require("zod");

// Importation des modèles liés
const { xmodel: Type } = require("../categories/type/model");
const { xmodel: Category } = require("../categories/model");
const { xmodel: Partner } = require("../partners/model");

class Contents extends Model {}

Contents.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },

    mulr: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { arg: true, msg: "mulr already exist" },
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { arg: true, msg: "name already exist" },
    },

    originalName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    path: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    mimetype: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isfree: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    synopsis: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    type_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    partner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    child_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    latestupdateby: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    paranoid: true,
  },
);
Contents.belongsTo(Type, {
  foreignKey: "type_id",
  as: "type",
});

Contents.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

Contents.belongsTo(Partner, {
  foreignKey: "partner_id",
  as: "partner",
});

// Auto-références pour les contenus parents et enfants
Contents.belongsTo(Contents, {
  foreignKey: "parent_id",
  as: "parent",
});

Contents.belongsTo(Contents, {
  foreignKey: "child_id",
  as: "child",
});

const createSchema = z.object({
  mulr: z.string().min(1, { message: "mulr is required" }),
  name: z.string().min(1, { message: "name is required" }),
  description: z.string().optional().nullable(),
  synopsis: z.string().optional().nullable(),
  isfree: z
    .preprocess((val) => val === "true" || val === true, z.boolean())
    .optional(),
  type_id: z.string().uuid({ message: "Invalid type_id UUID" }),
  category_id: z.string().uuid({ message: "Invalid category_id UUID" }),
  partner_id: z.string().uuid({ message: "Invalid partner_id UUID" }),
  parent_id: z
    .string()
    .uuid({ message: "Invalid parent_id UUID" })
    .optional()
    .nullable(),
  child_id: z
    .string()
    .uuid({ message: "Invalid child_id UUID" })
    .optional()
    .nullable(),
  metadata: z.unknown().optional().nullable(),
  latestupdateby: z.unknown().optional().nullable(),
  originalName: z.string().optional().nullable(),
  path: z.string().optional().nullable(),
  size: z.number().optional().nullable(),
  mimetype: z.string().optional().nullable(),
});

const readSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
});

const updateSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  mulr: z.string().min(1, { message: "mulr cannot be empty" }).optional(),
  name: z.string().min(1, { message: "name cannot be empty" }).optional(),
  description: z.string().optional().nullable(),
  synopsis: z.string().optional().nullable(),
  isfree: z
    .preprocess((val) => val === "true" || val === true, z.boolean())
    .optional(),
  type_id: z.string().uuid({ message: "Invalid type_id UUID" }).optional(),
  category_id: z
    .string()
    .uuid({ message: "Invalid category_id UUID" })
    .optional(),
  partner_id: z
    .string()
    .uuid({ message: "Invalid partner_id UUID" })
    .optional(),
  parent_id: z
    .string()
    .uuid({ message: "Invalid parent_id UUID" })
    .optional()
    .nullable(),
  child_id: z
    .string()
    .uuid({ message: "Invalid child_id UUID" })
    .optional()
    .nullable(),
  metadata: z.unknown().optional().nullable(),
  latestupdateby: z.unknown().optional().nullable(),
  originalName: z.string().optional().nullable(),
  path: z.string().optional().nullable(),
  size: z.number().optional().nullable(),
  mimetype: z.string().optional().nullable(),
});

Contents.sync()
  .then(() => {
    console.log("Table Contents Synced.");
  })
  .catch((error) => {
    console.error("Error creating table:", error);
  });

const moduleName = "contents";
const xmodel = Contents;

module.exports = {
  xmodel,
  createSchema,
  readSchema,
  updateSchema,
  moduleName,
};
