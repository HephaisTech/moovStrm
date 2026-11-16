export const guard = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ApiResponse.unauthorized(res, "Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`.toUpperCase(),
    );
    req.user = decoded;
    next();
  } catch (err) {
    return ApiResponse.unauthorized(res, "Invalid token");
  }
};
