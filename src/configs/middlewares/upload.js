const ApiResponse = require("../utils/ApiResponse");
const { xmodel: Partner } = require("../../modules/partners/model");
const path = require("path");
const fs = require("fs");

export const checkupload = async (req, res, next) => {
  try {
    if (!req.file) return ApiResponse.badRequest(res, "No file uploaded");
    if (!req.body.partnerId)
      return ApiResponse.badRequest(res, "partnerId is required !");
    const partnervi = await Partner.findByPk(`${req.body.partnerId}`);
    if (!partnervi) return ApiResponse.notFound(res, "Partner not found !");
    const file = req.file;
    // check if the file is a video
    const allowedMimeTypes = [
      "video/mp4",
      "video/mkv",
      "video/avi",
      "video/mov",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return ApiResponse.badRequest(
        res,
        "Invalid file type. Only video files are allowed.",
      );
    }
    const allowedExtensions = [".mp4", ".mkv", ".avi", ".mov", ".webm"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      return ApiResponse.badRequest(
        res,
        "Invalid file extension. Only video files are allowed.",
      );
    }

    req.body.partnerShortcode = partnervi.shortcode;
    next();
  } catch (error) {
    return ApiResponse.internalServerError(res, error.message);
  }
};

export const writeFileToDisk = async (req, res, next) => {
  try {
    if (!req.file) {
      return ApiResponse.badRequest(res, "No file uploaded");
    }

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "videos",
      `${req.body.partnerShortcode}`,
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const ext = path.extname(req.file.originalname);
    const filePath = path.join(uploadDir, req.file.originalname);
    await Bun.write(filePath, req.file.buffer);
    req.body.originalName = req.file.originalname;
    // complete  les champs dont on a besoin pour la création du contenu qui ne sont pas obligatoires pour l'utilisateur mais qui sont nécessaires pour le service
    let mulr;
    if (!req.body.mulr) {
      mulr = `${path.relative(process.cwd(), filePath).replace(/\\/g, "/")}`;
    }

    Object.assign(req.body, {
      mulr,
      name: req.body.name || path.parse(req.file.originalname).name,
      originalName: req.file.originalname,
      path: `${filePath}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
      partner_id: req.body.partnerId,
      isfree: false,
      parent_id: req.body.parent_id || null,
      child_id: req.body.child_id || null,
    });

    console.log(req.body);

    next();
  } catch (error) {
    return ApiResponse.internalServerError(res, error.message);
  }
};

export const deleteFileFromDisk = async (req, res, next) => {
  try {
    if (!req.body.mulr) {
      return ApiResponse.badRequest(res, "mulr is required to delete the file");
    }
    const filePath = path.join(process.cwd(), req.body.mulr);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File ${filePath} deleted successfully.`);
    } else {
      console.log(`File ${filePath} does not exist.`);
    }
  } catch (error) {
    return ApiResponse.internalServerError(res, error.message);
  }
};

export const gotoUploadView = async (req, res, next) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../../public/pages/partners/upload.html",
    );
    return res.sendFile(filePath);
  } catch (error) {
    return ApiResponse.internalServerError(res, error.message);
  }
};
