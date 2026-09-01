const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const validate = require("../../middleware/validate");
const { signupSchema, loginSchema, updateUserSchema,
    forgotPasswordSchema, resetPasswordSchema,
    verifyEmailSchema, resendVerificationSchema,
    googleLoginSchema } = require("./user.schema");
const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");
const loginLimiter = require("../../middleware/rateLimit.middleware");

router.post(
    "/signup",
    validate(signupSchema),
    userController.signup
);

 router.post(
    "/login",
    loginLimiter,
    validate(loginSchema),
    userController.login
);

router.post(
    "/refresh-token", 
    userController.refreshToken
);

router.get(
    "/profile", 
    protect,
    userController.getProfile
);

router.post(
    "/logout",
    protect, 
    userController.logout
);

router.get(
    "/admin-only",
    protect,
    authorize("admin"),
    userController.adminOnly
);

router.patch(
    "/:id", 
    protect, 
    validate(updateUserSchema),
    userController.updateUser
);

router.post(
    "/forgot-password", 
    validate(forgotPasswordSchema),
    userController.forgotPassword
);

router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    userController.resetPassword
);

router.post(
    "/verify-email", 
    validate(verifyEmailSchema), 
    userController.verifyEmail
);

router.post(
    "/resend-verification", 
    validate(resendVerificationSchema), 
    userController.resendVerification
);

router.post(
    "/google-login", 
    validate(googleLoginSchema), 
    userController.googleLogin
);

module.exports = router;