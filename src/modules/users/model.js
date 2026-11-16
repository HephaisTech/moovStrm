const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../configs/db/doa");
const { z } = require("zod");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    userType: {
      type: DataTypes.ENUM(["Local user", "Org user"]),
      allowNull: false,
      defaultValue: "Local user",
      field: "type",
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { arg: true, msg: "Username already exists" },
    },
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "full_name",
    },
    twoFactorAuthentication: {
      type: DataTypes.ENUM("Enabled", "Disabled"),
      defaultValue: "Disabled",
      allowNull: false,
      field: "two_factor_authentication",
    },
    mobileNumber: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "mobile_number",
    },
    emailAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: { arg: true, msg: "Email address already exists" },
      validate: {
        isEmail: true,
      },
      field: "email_address",
    },
    welcomeMessage: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "welcome_message",
    },
    enablementStatus: {
      type: DataTypes.ENUM("Enabled", "Disabled"),
      defaultValue: "Enabled",
      allowNull: false,
      field: "enablement_status",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    passwordLastChanged: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "password_last_changed",
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_login",
    },
    lastLogout: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_logout",
    },
    loginStatus: {
      type: DataTypes.ENUM("Online", "Offline"),
      defaultValue: "Offline",
      allowNull: false,
      field: "login_status",
    },
    lockStatus: {
      type: DataTypes.ENUM("Locked", "Unlocked"),
      defaultValue: "Unlocked",
      allowNull: false,
      field: "lock_status",
    },
  },
  {
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

User.sync()
  .then(() => {
    console.log("Table users Synced.");
  })
  .catch((error) => {
    console.error("Error creating table:", error);
  });

const createSchema = z.object({
  userType: z.string().optional(),
  username: z
    .string()
    .min(3, {
      message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
    })
    .max(100, {
      message: "Le nom d'utilisateur ne peut pas dépasser 100 caractères",
    }),
  fullName: z
    .string()
    .min(1, { message: "Le nom complet est requis" })
    .max(150, {
      message: "Le nom complet ne peut pas dépasser 150 caractères",
    }),
  twoFactorAuthentication: z.enum(["Enabled", "Disabled"]).optional(),
  mobileNumber: z.string().max(30).optional().nullable(),
  emailAddress: z
    .string()
    .email({ message: "Email invalide" })
    .optional()
    .nullable(),
  welcomeMessage: z.string().max(255).optional().nullable(),
  enablementStatus: z.enum(["Enabled", "Disabled"]).optional(),
  description: z.string().optional().nullable(),
  department: z.string().max(100).optional().nullable(),
  loginStatus: z.enum(["Online", "Offline"]).optional(),
  lockStatus: z.enum(["Locked", "Unlocked"]).optional(),
});

const readSchema = z.object({
  id: z.string().uuid({ message: "L'ID doit être un UUID valide" }).optional(),
  username: z.string().optional(),
  emailAddress: z.string().optional(),
  search: z.string().max(100).optional(),
});

const updateSchema = z.object({
  id: z.string().uuid({ message: "L'ID doit être un UUID valide" }),
  userType: z.string().optional(),
  username: z.string().min(3).max(100).optional(),
  fullName: z.string().max(150).optional(),
  twoFactorAuthentication: z.enum(["Enabled", "Disabled"]).optional(),
  mobileNumber: z.string().max(30).optional().nullable(),
  emailAddress: z.string().email().optional().nullable(),
  welcomeMessage: z.string().max(255).optional().nullable(),
  enablementStatus: z.enum(["Enabled", "Disabled"]).optional(),
  description: z.string().optional().nullable(),
  department: z.string().max(100).optional().nullable(),
  loginStatus: z.enum(["Online", "Offline"]).optional(),
  lockStatus: z.enum(["Locked", "Unlocked"]).optional(),
});

const moduleName = "operators";
const xmodel = User;

module.exports = { xmodel, createSchema, readSchema, updateSchema, moduleName };
