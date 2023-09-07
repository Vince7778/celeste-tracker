/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    projects: [
        {
            displayName: "client",
            testEnvironment: "jsdom",
            preset: "ts-jest",
            rootDir: "client/",
            moduleNameMapper: {
                "\\.(css|less|scss|sass)$": "<rootDir>/styleMock.js",
            },
        },
        {
            displayName: "server",
            testEnvironment: "node",
            preset: "ts-jest",
            testPathIgnorePatterns: ["client"],
        },
    ],
};
