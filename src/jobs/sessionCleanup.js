const userRepository = require("../modules/users/user.repository")

const cleanupExpiredSessions = async () => {
    try {
        const deletedCount = await userRepository.deleteExpiredRefreshTokens();

        console.log(
            `[SESSION CLEANUP] Removed ${deletedCount} expired sessions`
        );
    } catch (error) {
        console.error("[SESSION CLEANUP] failed:", error);
    }
};

module.exports = cleanupExpiredSessions;