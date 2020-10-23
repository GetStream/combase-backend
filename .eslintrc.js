module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["get-off-my-lawn", "plugin:prettier/recommended"],
  parser: "babel-eslint",
  plugins: ["prettier"],
  rules: {
    "sort-keys": 0,
    "spaced-comment": 0,
    "import/namespace": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 0,
    "import/order": 0,
    "no-warning-comments": 0,
    "no-empty-function": 0,
    "eslint-comments/no-unused-disable": 0,
    "no-process-exit": 0,
    "node/no-extraneous-import": 0,
    "node/no-unpublished-import": 0,
  },
};
