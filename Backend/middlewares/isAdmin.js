import { ApiError } from "../utils/ApiError.js";

export const isAdmin = (req, res, next) => {
  req.user = user;
  if (!user) {
    throw new ApiError(401, "Unathorized");
  }
  if (user.role !== "admin") {
    throw new ApiError(403, "Unathorized");
  }
  next();
};
