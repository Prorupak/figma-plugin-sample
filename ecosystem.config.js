const { cpus } = require("node:os");
const { config: dotConfig } = require("dotenv");

dotConfig({ path: ".env" });

const cpuLen = cpus().length;

module.exports = {
  apps: [
    {
      name: "text-search-api",
      script: "./dist/index.js",
      autorestart: true,
      exec_mode: "cluster",
      watch: false,
      instances: cpuLen,
      max_memory_restart: "1G",
      args: "",
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
      },
    },
  ],
};
