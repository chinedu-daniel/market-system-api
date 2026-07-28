const { frontendUrl } = require("../../config/app.config");
const { sendEmail } = require("./transport");

exports.sendPasswordResetEmail = async (user, rawToken) => {
    const resetUrl = `${frontendUrl}/verify-email?token=${rawToken}`

    await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Reset your password here: ${resetUrl}`,
        html: `
            <h2>Password Reset</h2>

            <p>Click the link below to reset your password:</p>

            <a href="${resetUrl}">
                Reset Password
            </a>

            <p>This link expires in 10 minutes.</p>
        `
    });
}