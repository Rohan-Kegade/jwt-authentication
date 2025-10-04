import { userRepository } from "../repositories/user.repository.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  user.refreshToken = refreshToken;
  await userRepository.save(user);

  return { accessToken, refreshToken };
};

export const userService = {
  // REGISTER
  async registerUser(req) {
    const { email, username, password } = req.body;

    if ([email, username, password].some((f) => f?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      email,
      username: username.toLowerCase(),
      password: hashedPassword,
    });

    await userRepository.save(newUser);

    // remove sensitive data
    delete newUser.password;
    delete newUser.refreshToken;

    return newUser;
  },

  // LOGIN
  async loginUser(req) {
    const { email, username, password } = req.body;

    if (!username && !email) {
      throw new ApiError(400, "Username or email is required");
    }

    const user = await userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    delete user.password;
    delete user.refreshToken;

    return { user, accessToken, refreshToken };
  },

  // LOGOUT
  async logoutUser(userId) {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");

    user.refreshToken = null;
    await userRepository.save(user);
  },

  // REFRESH TOKEN
  async refreshAccessToken(req) {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken)
      throw new ApiError(401, "Unauthorized - Missing refresh token");

    let decoded;
    try {
      decoded = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await userRepository.findOne({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token expired or invalid");
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    return { accessToken, refreshToken };
  },
};
