// module.exports = {
//   presets: ['module:@react-native/babel-preset', "nativewind/babel"],
//   plugins: [
//     [
//       'module-resolver',
//       {
//         alias: {
//           '@/': './',
//         },
//       },
//     ],
//   ],
// };
// module.exports = {
//   presets: ['module:@react-native/babel-preset', "nativewind/babel"],
//   plugins: [
//    'babel-plugin-styled-components',  // Styled Components plugin
//     [
//       'module-resolver',  // Configures the @/ alias
//       {
//         root: ['./'],
//         alias: {
//           '@/': './components',  // Adjust this path according to your folder structure
//         },
//       },
//     ],
//   ],
  
// };
module.exports = {
  presets: ['module:@react-native/babel-preset', "nativewind/babel"],

  plugins: [["module-resolver", {
    root: ["./"],
    extensions: [".js", ".ts", ".tsx", ".jsx"],

    alias: {
      "@": "./"
    }
  }]]
};