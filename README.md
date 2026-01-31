# @codearcade/expo-markdown

A modern, feature-rich Markdown renderer for React applications. Built for **speed**, **customizability**, and **developer experience**.

Packed with **syntax highlighting**, **copy-to-clipboard** functionality, and seamless **dark mode** support out of the box.

---

## ✨ Features

- ⚡ **Powered by MarkdownIt**: Robust and reliable rendering using `markdown-it`.
- 🎨 **Theming Support**: First-class support for Light and Dark modes with customizable colors.
- 💅 **Syntax Highlighting**: Integrated Prism syntax highlighting (supports themes via toggling).
- 📋 **Copy Code**: Automatic "Copy to Clipboard" button for all code blocks.
- 🍭 **GFM Support**: GitHub Flavored Markdown (tables, autolinks, etc.) enabled by default.
- 🔌 **Plug & Play**: Works instantly with minimal configuration.

---

## Installation

Install the package via your preferred package manager:

```bash
npm install @codearcade/expo-markdown
# or
yarn add @codearcade/expo-markdown
# or
pnpm add @codearcade/expo-markdown
# or
bun add @codearcade/expo-markdown
```

> **Note**: This package requires `expo-clipboard` as a peer dependency for the copy-to-clipboard functionality.

```bash
npx expo install expo-clipboard
```

## Usage

Using `@codearcade/expo-markdown` is simple. Import the `Markdown` component and pass your content string.

### Basic Usage

```tsx
import { Markdown } from "@codearcade/expo-markdown";

const markdown = `
# Hello World

This is a **markdown** component.

\`\`\`javascript
console.log("Hello from CodeArcade!");
\`\`\`
`;

export default function App() {
  return (
    <div style={{ flex: 1 }}>
      <Markdown content={markdown} />
    </div>
  );
}
```

### Dark Mode & Custom Themes

Easily switch between light and dark modes, and customize the color palette for each mode.

```tsx
import { useState } from "react";
import { View } from "react-native";
import { Markdown } from "@codearcade/expo-markdown";

const myDarkTheme = {
  backgroundColor: "#1e1e1e",
  textColor: "#e0e0e0",
  codeBackgroundColor: "#252526",
  primaryColor: "#569cd6",
  secondaryColor: "#4ec9b0",
};

export default function BlogPost() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Markdown
        content="# My Blog Post"
        theme={isDarkMode ? "dark" : "light"}
        // Optional: Customize themes
        defaultDarkTheme={myDarkTheme}
      />
    </View>
  );
}
```

## API Reference

### `<Markdown />`

| Prop                | Type                | Default                 | Description                                   |
| ------------------- | ------------------- | ----------------------- | --------------------------------------------- |
| `content`           | `string`            | **Required**            | The raw markdown string to render.            |
| `theme`             | `"light" \| "dark"` | `"light"`               | Controls the rendering mode of the component. |
| `defaultLightTheme` | `ThemeConfig`       | `Default Light Palette` | Custom colors for light mode.                 |
| `defaultDarkTheme`  | `ThemeConfig`       | `Default Dark Palette`  | Custom colors for dark mode.                  |

### ThemeConfig Interface

The theme objects (`defaultLightTheme` and `defaultDarkTheme`) should follow this structure:

```typescript
interface ThemeConfig {
  backgroundColor: string;
  textColor: string;
  codeBackgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
}
```

## License

MIT © [CodeArcade](https://github.com/codearcade-io)
