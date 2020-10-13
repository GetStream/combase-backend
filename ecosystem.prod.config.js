/* eslint-disable */
module.exports = {
  apps: [
    {
      name: "api",
      script: "dist/index.js",
      output: "/dev/stdout",
      error: "/dev/stderr",
      merge_logs: true,
      instances: process.env.WEB_CONCURRENCY || 2,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
    },
  ],
};
