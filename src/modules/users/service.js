const BaseController = require("../../configs/core/base_services");
const ApiResponse = require("../../configs/utils/ApiResponse");
const {
  xmodel,
  createSchema,
  readSchema,
  updateSchema,
  moduleName,
} = require("./model");

const ACCESS_SECRET = new TextEncoder().encode(
  `${process.env.JWT_SECRET}`.toUpperCase() ||
    "votre_cle_secrete_access_token_12345",
);

// const REFRESH_SECRET = new TextEncoder().encode(
//   process.env.JWT_REFRESH_SECRET || "votre_cle_secrete_refresh_token_67890",
// );

class Controller extends BaseController {
  constructor() {
    super(xmodel, createSchema, readSchema, updateSchema, moduleName);
  }

  Signup = async (req, res, next) => {
    try {
      const validationResult = createSchema.safeParse(req.body);
      if (!validationResult.success) {
        return ApiResponse.badRequest(
          res,
          validationResult.error.errors,
          400,
          false,
          "validation error",
        );
      }
      const data = validationResult.data;
      const existingUser = await xmodel.findOne({
        where: { emailAddress: data.emailAddress },
      });
      if (existingUser) {
        return ApiResponse.badRequest(res, "user already exists", 409, false);
      }
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      const newUser = await xmodel.create(data);
      const userResponse = newUser.toJSON();
      delete userResponse.password;

      return ApiResponse.ok(
        res,
        userResponse,
        201,
        true,
        "Utilisateur créé avec succès",
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return ApiResponse.badRequest(
          res,
          " please provide username and password",
        );
      }

      const user = await xmodel.findOne({ where: { username } });
      if (!user) {
        return ApiResponse.badRequest(res, "Invalid username or password");
      }

      // Vérification du statut du compte
      if (user.enablementStatus !== "Enabled" || user.lockStatus === "Locked") {
        return ApiResponse.badRequest(res, "Account locked or inactive");
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password || "",
      );
      if (!isPasswordValid) {
        return ApiResponse.badRequest(res, "Invalid username or password");
      }
      const payload = {
        id: user.id,
        username: user.username,
        userType: user.userType,
      };

      const accessToken = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h") // Courte durée pour l'access token
        .sign(ACCESS_SECRET);

      // const refreshToken = await new SignJWT(payload)
      //   .setProtectedHeader({ alg: "HS256" })
      //   .setIssuedAt()
      //   .setExpirationTime("7d") // Plus longue durée pour le refresh token
      //   .sign(REFRESH_SECRET);

      // Mise à jour du statut de connexion
      await user.update({
        lastLogin: new Date(),
        loginStatus: "Online",
      });

      const userResponse = user.toJSON();
      delete userResponse.password;

      return ApiResponse.ok(
        res,
        {
          accessToken,
          user: userResponse,
        },
        200,
        true,
        "success",
      );
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new Controller();
