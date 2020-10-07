module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["get-off-my-lawn", "plugin:prettier/recommended"],
  parser: "babel-eslint",
  plugins: ["prettier"],
  rules: {
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 0,
    "no-console": 0,
    "no-warning-comments": 0,
    "node/no-extraneous-import": 0,
    "node/no-unpublished-import": 0,
  },
};
