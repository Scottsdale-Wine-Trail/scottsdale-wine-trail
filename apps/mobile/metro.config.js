// Metro config tuned for the pnpm monorepo so the mobile app can resolve
// workspace packages (e.g. @swt/shared) and the hoisted root node_modules.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch the whole monorepo so changes in packages/* are picked up.
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from the app first, then the hoisted root store.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. pnpm uses symlinks; let Metro follow them.
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
