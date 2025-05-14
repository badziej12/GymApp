// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, { isCSSEnabled: true })

config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './global.css' })
