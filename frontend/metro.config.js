const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Setup SVG Transformer
const { transformer, resolver } = config;

config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
    svgrOptions: {
        replaceAttrValues: {
            '#FFFFFF': 'currentColor',
            '#ffffff': 'currentColor',
            '#fff': 'currentColor',
            white: 'currentColor',
        },
    },
};

config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"]
};

// Export wrapped with NativeWind
module.exports = withNativeWind(config, { input: './global.css' });