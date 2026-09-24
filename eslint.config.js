const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                ...globals.node,
            },
        },
    },

    {
        files: ["**/*.test.js"],

        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },

    js.configs.recommended,
];