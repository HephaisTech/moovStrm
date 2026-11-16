const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../../configs/db/doa");
const { z } = require("zod");

class Type extends Model {}

Type.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { arg: true, msg: "name already exist" },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },
    metadata: { type: DataTypes.JSON, allowNull: true },
    latestupdateby: { type: DataTypes.JSON, allowNull: true },
  },
  {
    sequelize,
    paranoid: true,
    timestamps: true,
  },
);

const createSchema = z.object({
  name: z
    .string()
    .min(1, { message: "name is required" })
    .max(255, { message: "name cannot exceed 255 characters" }),
  description: z
    .string()
    .max(2000, {
      message: "description cannot exceed 2000 characters",
    })
    .optional()
    .nullable(),
  metadata: z.record(z.any()).optional().nullable(),
  latestupdateby: z.object({}).optional().nullable(),
});

const readSchema = z.object({
  id: z.string().uuid({ message: "The ID must be a valid UUID" }).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  search: z.string().max(100).optional(),
});

const updateSchema = z.object({
  id: z.string().uuid({ message: "The ID must be a valid UUID" }),
  name: z
    .string()
    .min(1, { message: "name is required" })
    .max(255, { message: "name cannot exceed 255 characters" })
    .optional(),
  description: z
    .string()
    .max(2000, {
      message: "description cannot exceed 2000 characters",
    })
    .optional()
    .nullable(),
  metadata: z.record(z.any()).optional().nullable(),
  latestupdateby: z.object({}).optional().nullable(),
});

Type.sync()
  .then(() => {
    console.log("Table type Synced.");
  })
  .catch((error) => {
    console.error("Error creating table: type", error);
  });

const moduleName = "types";
const xmodel = Type;

module.exports = { xmodel, createSchema, readSchema, updateSchema, moduleName };
