const { frontendUrl } = require("../../config/app.config");
const { sendEmail } = require("./transport");

exports.sendVerificationEmail = async (user, rawToken) => {
    const verificationUrl = `${frontendUrl}/verify-email?token=${rawToken}`

    await sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Verify your email by visiting: ${verificationUrl}`,
        html: `
            <h2>Welcome to My Express App</h2>

            <p>Click the link below to verify your email:</p>

            <a href="${verificationUrl}">
            Verify Email
            </a>

            <p>This link expires in 10 minutes.</p>
        `
    });
}