module.exports = {
  apps: [
    {
      name: "api",
      script: "src/index.js",
      output: "/dev/stdout",
      error: "/dev/stderr",
      interpreter: "babel-node",
      watch: true,
      ignore_watch: [".git", "node_modules"],
    },
  ],
};
