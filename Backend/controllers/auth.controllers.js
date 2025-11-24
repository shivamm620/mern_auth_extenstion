import { asyncHandler } from "../middlewares/asyncHandler.js";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/sendEmail.js";
export const singUp = asyncHandler(async (req, res) => {
  const { username, name, email, password } = req.body;
  if (!username || !name || !email || !password) {
    throw new ApiError(400, "Enter Every Fields");
  }
  const existingEmail = await UserModel.findOne({ email });
  if (existingEmail) {
    throw new ApiError(400, "Email Already in Use");
  }
  const user = new UserModel({
    username,
    name,
    email,
    password,
  });
  await user.save();
  const safeUser = {
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
  };
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.EMAIL_VERIFY_SECRET,
    { expiresIn: "1d" }
  );
  const mailOption = {
    from: process.env.GMAIL_MAIL,
    to: user.email,
    subject: "Email Verify",
    text: "This is a test email sent using Nodemailer",
    html: `<h2>Hello ${user.name}</h2>
    <p>Click the link below to verify your email:</p>
    <a href="http://localhost:5173/verify-email/${token}">
      Verify Email
    </a>
  `,
  };
  try {
    await transporter.sendMail(mailOption);
  } catch (error) {
    await UserModel.findByIdAndDelete(user._id);
    throw new ApiError(500, "Error While Sending Email");
  }
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: safeUser },
        "User Created Successfully Please Check Your Email"
      )
    );
});
export const singIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Enter Every Field");
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "Invaild Enteries");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(404, "Invaild Enteries");
  }
  const createAccessToken = user.genaccessToken();
  const createRefreshToken = user.genrefreshToken();
  user.refreshToken.push(createRefreshToken);
  await user.save({ validateBeforeSave: false });

  if (req.headers["x-platform"] === "web") {
    res.cookie("accesstoken", createAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshtoken", createRefreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      path: "/",
      maxAge: 30 * 60 * 1000,
    });
    res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
          },
        },
        "User Login Successfully"
      )
    );
  } else {
    res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
          },
          accessToken: createAccessToken,
          refreshToken: createRefreshToken,
        },
        "User Login Successfully"
      )
    );
  }
});
export const profile = asyncHandler(async (req, res) => {
  const user = req.user;
  res
    .status(200)
    .json(new ApiResponse(200, user, "Profile Fetch Successfully"));
});
export const verify_Email = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(401, "Token is Invalid");
  }
  try {
    const decode = jwt.verify(token, process.env.EMAIL_VERIFY_SECRET);
    const user = await UserModel.findById(decode.id);
    const safeUser = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    };
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.isVerified) {
      const accessToken = await user.genaccessToken();
      if (req.headers["x-platform"] === "web") {
        res.cookie("accesstoken", accessToken, {
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "None",
        });

        return res.json(
          new ApiResponse(200, { user: safeUser }, "User Verified Already")
        );
      } else {
        return res.json(
          new ApiResponse(
            200,
            { user: safeUser, accessToken: accessToken },
            "User Verified Already"
          )
        );
      }
    }
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });
    const createAccessToken = await user.genaccessToken();
    if (req.headers["x-platform"] === "web") {
      res.cookie("accesstoken", createAccessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "None",
      });

      return res.json(
        new ApiResponse(200, { user: safeUser }, "Email Verified Successfully")
      );
    } else {
      return res.json(
        new ApiResponse(
          200,
          { user: safeUser, accessToken: createAccessToken },
          "Email Verified Successfully"
        )
      );
    }
  } catch (error) {
    throw new ApiError(404, "Email Verification Error Please Try Again ");
  }
});

export const autoLogin = asyncHandler(async (req, res) => {
  const accessToken =
    req.cookies?.accesstoken ||
    req.header("Authorization")?.replace(/^Bearer\s*/, "");
  const refreshToken = req.cookies?.refreshtoken || req.body?.refreshToken;

  if (accessToken) {
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET
      );
      const user = await UserModel.findById(decoded.id);

      if (!user) {
        return res
          .status(401)
          .json(new ApiResponse(401, null, "User not found"));
      }

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            user: {
              id: user._id,
              email: user.email,
              username: user.username,
              name: user.name,
              role: user.role,
              isVerified: user.isVerified,
            },
          },
          "Auto login successful"
        )
      );
    } catch (err) {
      return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
    }
  }

  if (refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET
      );
      const user = await UserModel.findById(decoded.id);

      if (!user)
        return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
      if (!user.refreshToken.includes(refreshToken)) {
        return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
      }

      user.refreshToken = user.refreshToken.filter((t) => t !== refreshToken);
      const newAccessToken = await user.genaccessToken();
      const newRefreshToken = await user.genrefreshToken();

      user.refreshToken.push(newRefreshToken);
      await user.save({ validateBeforeSave: false });
      if (req.headers["x-platform"] === "web") {
        res.cookie("accesstoken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          path: "/",
          maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshtoken", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          path: "/",
          maxAge: 30 * 60 * 1000,
        });

        return res.status(200).json(
          new ApiResponse(
            200,
            {
              user: {
                id: user._id,
                email: user.email,
                username: user.username,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified,
              },
            },
            "Auto login successful"
          )
        );
      } else {
        return res.status(200).json(
          new ApiResponse(
            200,
            {
              user: {
                id: user._id,
                email: user.email,
                username: user.username,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified,
              },
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            },
            "Auto login successful"
          )
        );
      }
    } catch (err) {
      return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
    }
  }
  return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
});

export const resendEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(email);

  if (!email) {
    throw new ApiError(404, "Email Required");
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "Please Singup");
  }

  if (user.isVerified) {
    return res.json(new ApiResponse(200, {}, "User already verified"));
  }
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.EMAIL_VERIFY_SECRET,
    { expiresIn: "1d" }
  );
  const mailOption = {
    from: process.env.GMAIL_MAIL,
    to: user.email,
    subject: "Resend Email Verification",
    html: `
      <h2>Hello ${user.name}</h2>
      <p>Click the link below to verify your email:</p>
      <a href="http://localhost:5173/verify-email/${token}">
        Verify Email
      </a>
    `,
  };

  try {
    await transporter.sendMail(mailOption);
  } catch (error) {
    throw new ApiError(500, "Failed to send verification email");
  }

  return res.json(
    new ApiResponse(
      200,
      {},
      "Verification email resent successfully. Please check inbox."
    )
  );
});
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshtoken || req.body?.refreshToken;
  const found_user = await UserModel.findById(req.user.id);
  if (!found_user) {
    throw new ApiError(404, "user not found");
  }
  res.clearCookie("accesstoken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  found_user.refreshToken = found_user.refreshToken.filter(
    (t) => t !== refreshToken
  );
  await found_user.save({ validateBeforeSave: false });
  res.status(200).json(new ApiResponse(200, {}, "User Logout"));
});

export const allLogout = asyncHandler(async (req, res) => {
  const found_user = await UserModel.findById(req.user.id);
  if (!found_user) {
    throw new ApiError(404, "user not found");
  }
  res.clearCookie("accesstoken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  found_user.refreshToken = [];
  await found_user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, {}, "User Logout From All Devices"));
});

export const admin = asyncHandler(async (req, res) => {});
