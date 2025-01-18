// const { withNativeWind } = require('nativewind/metro');
// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */

// // Get default metro config
// const defaultConfig = getDefaultConfig(__dirname);

// // Merge with nativewind config and add alias for '@/'
// const config = mergeConfig(defaultConfig, {
//   transformer: {
//     babelTransformerPath: require.resolve('react-native-svg-transformer'),  // Add SVG transformer
//   },
//   resolver: {
//     assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),  // Exclude .svg from assetExts
//     sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],  // Include .svg in sourceExts
//     extraNodeModules: {
//       '@/': __dirname,  // Map @/ to the root directory
//     },
//   },
// });

// // Export the updated config with NativeWind integration
// module.exports = withNativeWind(config, {
//   input: "./global.css"
// });


// const {withNativeWind} = require('nativewind/metro');
// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = mergeConfig(getDefaultConfig(__dirname), {});

// module.exports = withNativeWind(config, {
//  input: "./global.css"
// });

// const {withNativeWind} = require('nativewind/metro');
// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = mergeConfig(getDefaultConfig(__dirname), {});

// module.exports = withNativeWind(config, {
//  input: "./global.css"
// });


const { withNativeWind } = require('nativewind/metro');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const {
  withSentryConfig
} = require("@sentry/react-native/metro");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = withSentryConfig(withNativeWind(
  mergeConfig(getDefaultConfig(__dirname), {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg'],
    },
  }),
  {
    input: './global.css',
  }
));