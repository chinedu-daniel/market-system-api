const bcrypt = require("bcrypt");

const pepper = process.env.PASSWORD_PEPPER || "";

function applyPepper(password) {
    return password + pepper;
}

exports.hashPassword = async (password) => {
    return bcrypt.hash(applyPepper(password), 12);
}

exports.comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(applyPepper(password), hashedPassword);
}