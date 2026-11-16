const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../configs/db/doa");
const { z } = require("zod");

class Partner extends Model {}

Partner.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    shortcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { arg: true, msg: "shortcode already exist" },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { arg: true, msg: "name already exist" },
    },
    description: { type: DataTypes.STRING, allowNull: true },
    metadata: { type: DataTypes.JSON, allowNull: true },
    latestupdateby: { type: DataTypes.JSON, allowNull: true },
  },
  {
    sequelize,
    timestamps: true,
    paranoid: true,
  },
);

Partner.sync()
  .then(() => {
    console.log("Table Partners Synced.");
  })
  .catch((error) => {
    console.error("Error creating table:", error);
  });

const createSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Le nom est requis" })
    .max(100, { message: "Le nom ne peut pas dépasser 100 caractères" }),
  description: z
    .string()
    .max(255, { message: "La description ne peut pas dépasser 255 caractères" })
    .optional()
    .nullable(),
  shortcode: z
    .string()
    .min(1, { message: "Le shortcode est requis" })
    .max(100, { message: "Le shortcode ne peut pas dépasser 100 caractères" })
    .optional()
    .nullable(),
  metadata: z.record(z.any()).optional().nullable(),
  latestupdateby: z.object({}).optional().nullable(),
});

const readSchema = z.object({
  id: z.string().uuid({ message: "L'ID doit être un UUID valide" }).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  shortcode: z.string().optional(),
  search: z.string().max(100).optional(),
});

const updateSchema = z.object({
  id: z.string().uuid({ message: "L'ID doit être un UUID valide" }),
  name: z
    .string()
    .min(1, { message: "Le nom est requis" })
    .max(100, { message: "Le nom ne peut pas dépasser 100 caractères" })
    .optional(),
  description: z
    .string()
    .max(255, { message: "La description ne peut pas dépasser 255 caractères" })
    .optional()
    .nullable(),
  shortcode: z
    .string()
    .min(1, { message: "Le shortcode est requis" })
    .max(100, { message: "Le shortcode ne peut pas dépasser 100 caractères" })
    .optional()
    .nullable(),
  metadata: z.record(z.any()).optional().nullable(),
  latestupdateby: z.object({}).optional().nullable(),
});

const moduleName = "partners";
const xmodel = Partner;

module.exports = { xmodel, createSchema, readSchema, updateSchema, moduleName };
