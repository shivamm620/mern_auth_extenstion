import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { UserModel } from "../models/user.model.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accesstoken ||
      req.header("Authorization")?.replace(/^Bearer\s*/, "");
    if (!token) {
      throw new ApiError(401, "Token is required");
    }
    const decode = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    if (!decode) {
      throw new ApiError(401, "Token is Invalid");
    }
    const user = await UserModel.findById(decode.id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(404, "User not found");

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
});
