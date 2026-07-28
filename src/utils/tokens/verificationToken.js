const crypto = require("crypto");

function createEmailverificationToken() {
    const rawToken = crypto
        .randomBytes(32)
        .toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    return {
        rawToken, 
        hashedToken, 
        expiresAt
    };
}

module.exports = createEmailverificationToken;