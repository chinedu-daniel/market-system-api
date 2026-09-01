const userRepository = require("./user.repository");
const {
  hashPassword,
  comparePassword,
  compareLegacyPassword,
} = require("../../utils/password");
const AppError = require("../../utils/appError");
const generateToken = require("../../utils/tokens/accessToken");
const generateRefreshToken = require("../../utils/tokens/refreshToken");
const jwt = require("jsonwebtoken");
const hashToken = require("../../utils/tokens/hashToken");
const generateResetToken = require("../../utils/tokens/resetToken");
const createEmailverificationToken = require("../../utils/tokens/verificationToken");
const refreshTokenRepository = require("./refreshToken.repository");
const { verifyGoogleToken } = require("../../utils/googleAuth");
const { message } = require("statuses");
const { frontendUrl } = require("../../config/app.config");
const {
  sendVerificationEmail,
} = require("../../utils/email/verificationEmail");
const {
  sendPasswordResetEmail,
} = require("../../utils/email/passwordResetEmail");

exports.signup = async (data) => {
  const { first_name, last_name, email, password } = data;

  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await userRepository.createUser({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  const { rawToken, hashedToken, expiresAt } = createEmailverificationToken();

  await userRepository.saveEmailVerificationToken(
    newUser.id,
    hashedToken,
    expiresAt,
  );

  const verificationUrl = `${frontendUrl}/verify-email?token=${rawToken}`;

  console.log("NODE_ENV =", process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    console.log("\n===========================");
    console.log("EMAIL SENDING DISABLED");
    console.log("Verification URL");
    console.log(verificationUrl);
    console.log("================================\n");
  } else {
    await sendVerificationEmail(newUser, rawToken);
  }

  return {
    user: {
      id: newUser.id,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      email: newUser.email,
      role: newUser.role,
    },
  };
};

exports.login = async (data) => {
  if (!data) {
    throw new AppError("Email or password is required", 400);
  }
  const { email, password } = data;

  if (!password) {
    throw new AppError("Password required", 400);
  }

  if (!email) {
    throw new AppError("Email required", 400);
  }

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.is_verified) {
    throw new AppError("Please verify your email before logging in", 403);
  }

  let isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    const legacyMatch = await compareLegacyPassword(password, user.password);

    if (!legacyMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const upgradedash = await hashPassword(password);

    await userRepository.updatePassword(user.id, upgradedash);
  }

  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  const hashedRefreshToken = hashToken(refreshToken);

  await userRepository.saveRefreshToken(user.id, hashedRefreshToken);

  return {
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

exports.logout = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  const hashedRefreshToken = hashToken(refreshToken);

  await userRepository.deleteRefreshToken(hashedRefreshToken);

  return { message: "Logged out successfully" };
};

exports.getProfile = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

exports.updateUser = async (targetUserId, currentUser, updateData) => {
  const isOwner = currentUser.id === Number(targetUserId);
  const isAdmin = currentUser.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Forbidden: you cannot update this user", 403);
  }

  const existingUser = await userRepository.findUserById(targetUserId);

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await userRepository.updateUserById(
    targetUserId,
    updateData,
  );

  return updatedUser;
};

exports.refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const hashedRefreshToken = hashToken(refreshToken);

  const storedToken = await userRepository.findRefreshToken(hashedRefreshToken);

  if (!storedToken) {
    throw new AppError("Refresh token not recognized", 401);
  }

  const user = await userRepository.findUserById(decoded.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await userRepository.deleteRefreshToken(hashedRefreshToken);

  const newAccessToken = generateToken(user);
  const newRefreshToken = generateRefreshToken(user);
  const hashedNewRefreshToken = hashToken(newRefreshToken);

  await userRepository.saveRefreshToken(user.id, hashedNewRefreshToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

exports.forgotPassword = async (email) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    return {
      message:
        "If an account with that email exists, a password reset link will be sent.",
    };
  }

  const { rawToken, hashedToken } = generateResetToken();

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await userRepository.savePasswordResetToken(user.id, hashedToken, expiresAt);

  const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

  if (process.env.NODE_ENV === "development") {
    console.log("\n====================");
    console.log("PASSWORD RESET EMAIL DISABLED");
    console.log("Reset URL:");
    console.log(resetUrl);
    console.log("========================\n");
  } else {
    await sendPasswordResetEmail(user, rawToken);
  }

  // await sendPasswordResetEmail(
  //     user,
  //     rawToken
  // );

  return {
    message:
      "If an account with that email exists, a password reset link will be sent.",
  };
};

exports.resetPassword = async (token, newPassword) => {
  const hashedToken = hashToken(token);

  const user = await userRepository.findUserByPasswordResetToken(hashedToken);

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  if (
    !user.password_reset_expires ||
    new Date(user.password_reset_expires) < new Date()
  ) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const hashedPassword = await hashPassword(newPassword);

  const updateUser = await userRepository.updatePasswordAfterReset(
    user.id,
    hashedPassword,
  );

  await refreshTokenRepository.deleteRefreshTokensByUserId(user.id);

  return updateUser;
};

exports.verifyEmail = async (token) => {
  const hashedToken = hashToken(token);

  const user =
    await userRepository.findUserByEmailVerificationToken(hashedToken);

  if (!user) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  const verifiedUser = await userRepository.markUserAsVerified(user.id);

  return verifiedUser;
};

exports.resendVerification = async (email) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.is_verified) {
    throw new AppError("Email is already verified", 400);
  }

  const { rawToken, hashedToken, expiresAt } = createEmailverificationToken();

  await userRepository.saveEmailVerificationToken(
    user.id,
    hashedToken,
    expiresAt,
  );

  const verificationUrl = `http://localhost:3000/verify-email?token=${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    text: `Verify here: ${verificationUrl}`,
    html: `
        <h2>Email Verification</h2>

        <a href="${verificationUrl}">
            Verify Email
        </a>

        <p>This link expires in 10 minutes.</p>
    `,
  });

  return {
    message: "Verification email sent successfully",
  };
};

exports.googleLogin = async (credential) => {
  let googleUser;

  try {
    googleUser = await verifyGoogleToken(credential);
  } catch (error) {
    throw new AppError("Invalid Google credential", 401);
  }

  const { googleId, email, first_name, last_name, emailVerified } = googleUser;

  if (!emailVerified) {
    throw new AppError("Google account email is not verified", 400);
  }

  // returning google user
  let user = await userRepository.findUserByGoogleId(googleId);

  //if no google user exists yet, try matching by email
  if (!user) {
    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
      // link google account to existing local account
      user = await userRepository.linkGoogleAccount(existingUser.id, googleId);
    } else {
      // create brand new google account
      user = await userRepository.createGoogleUser({
        id,
        first_name,
        last_name,
        email,
        role,
      });
    }
  }

  // Generate app token (same auth system as normal login)
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  const hashedRefreshToken = hashToken(refreshToken);

  await userRepository.saveRefreshToken(user.id, hashedRefreshToken);
  // await refreshTokenRepository.createRefreshToken(user.id, hashedRefreshToken);

  return {
    user,
    accessToken,
    refreshToken,
  };
};
