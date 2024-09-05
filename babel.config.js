module.exports = {
  presets: ['module:@react-native/babel-preset', "nativewind/babel"],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': '', // Replace './src' with your project structure
        },
      },
    ],
  ],
};
