import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { userService } from "../services/user.service.js";

// REGISTER
const registerUser = asyncHandler(async (req, res) => {
  const user = await userService.registerUser(req);
  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

// LOGIN
const loginUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await userService.loginUser(req);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// LOGOUT
const logoutUser = asyncHandler(async (req, res) => {
  await userService.logoutUser(req.user.id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// REFRESH TOKEN
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } =
    await userService.refreshAccessToken(req);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully"
      )
    );
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
