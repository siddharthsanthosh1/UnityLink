/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#4A90E2';  // Light blue
const tintColorDark = '#4A90E2';   // Light blue

export default {
  light: {
    text: '#000000',          // Black
    background: '#FFFFFF',     // White
    tint: tintColorLight,
    tabIconDefault: '#B0C4DE', // Light steel blue
    tabIconSelected: tintColorLight,
    border: '#E6F3FF',        // Very light blue
    icon: '#4A90E2',          // Light blue
  },
  dark: {
    text: '#000000',          // Black
    background: '#FFFFFF',     // White
    tint: tintColorDark,
    tabIconDefault: '#B0C4DE', // Light steel blue
    tabIconSelected: tintColorDark,
    border: '#E6F3FF',        // Very light blue
    icon: '#4A90E2',          // Light blue
  },
};
