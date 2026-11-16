const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../configs/db/doa");
const { z } = require("zod");

class Categorie extends Model {}

Categorie.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
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

Categorie.sync()
  .then(() => {
    console.log("Table categories Synced.");
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
  metadata: z.record(z.any()).optional().nullable(),
  latestupdateby: z.object({}).optional().nullable(),
});

const readSchema = z.object({
  id: z.string().uuid({ message: "L'ID doit être un UUID valide" }).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  communeId: z.string().uuid().optional(),
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
  communeId: z
    .string()
    .uuid({ message: "L'ID de la commune doit être un UUID valide" }),
  metadata: z.record(z.any()).optional().nullable(),
  latestupdateby: z.object({}).optional().nullable(),
});

const moduleName = "categories";
const xmodel = Categorie;

module.exports = { xmodel, createSchema, readSchema, updateSchema, moduleName };
