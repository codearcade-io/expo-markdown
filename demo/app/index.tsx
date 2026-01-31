import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Markdown } from "@/components/markdown";
import { TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const C = "```";
const A = "`";

const myMarkdown = `
# @codearcade/expo-markdown

A modern, feature-rich Markdown renderer for React applications. Built for **speed**, **customizability**, and **developer experience**.

Packed with **syntax highlighting**, **copy-to-clipboard** functionality, and seamless **dark mode** support out of the box.

---

## ✨ Features

- ⚡ **Powered by React Markdown**: Robust and reliable rendering.
- 🎨 **Theming Support**: First-class support for Light and Dark modes.
- 💅 **Syntax Highlighting**: Integrated Prism syntax highlighting with **50+ themes** (Dracula, Atom Dark, Night Owl, etc.).
- 📋 **Copy Code**: Automatic "Copy to Clipboard" button for all code blocks.
- 🍭 **GFM Support**: GitHub Flavored Markdown (tables, autolinks, strikethrough) enabled by default.
- 🔌 **Plug & Play**: Works instantly with minimal configuration.

---

## Installation

Install the package via your preferred package manager:

${C}"bash
npm install @codearcade/mdx
# or
yarn add @codearcade/mdx
# or
pnpm add @codearcade/mdx
# or
bun add @codearcade/mdx
${C}

## Usage

Using ${A}@codearcade/mdx${A} is simple. Import the component and pass your markdown string.

### Basic Usage

${C}tsx
import { MarkdownComponent } from "@codearcade/mdx";

const markdown = ${A}
# Hello World

This is a **markdown** component.

\${A}\${A}\${A}javascript
console.log("Hello from CodeArcade!");
\${A}\${A}\${A}
${A};

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <MarkdownComponent markdownText={markdown} />
    </div>
  );
}
${C}

### Dark Mode & Custom Themes

Easily switch between light and dark modes, and customize the syntax highlighting theme for each mode.

${C}tsx
import { useState } from "react";
import { MarkdownComponent } from "@codearcade/mdx";

export default function BlogPost() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={isDarkMode ? "dark-theme" : "light-theme"}>
      <button onClick={() => setIsDarkMode(!isDarkMode)}>Toggle Theme</button>

      <MarkdownComponent
        markdownText={content}
        theme={isDarkMode ? "dark" : "light"}
        // Customize syntax highlighting themes
        defaultMarkdownThemeLight="atomDark"
        defaultMarkdownThemeDark="dracula"
      />
    </div>
  );
}
${C}

## API Reference

### ${A}<MarkdownComponent />${A}

| Prop | Type | Default | Description |
|Text  |      |         |             |
| ${A}markdownText${A} | ${A}string${A} | **Required** | The raw markdown string to render. |
| ${A}theme${A} | ${A}"light" \| "dark"${A} | ${A}"light"${A} | Controls the rendering mode of the component. |
| ${A}defaultMarkdownThemeLight${A} | ${A}MarkdownTheme${A} | ${A}"a11yDark"${A} | Syntax highlighting theme to use when ${A}theme${A} is ${A}"light"${A}. |
| ${A}defaultMarkdownThemeDark${A} | ${A}MarkdownTheme${A} | ${A}"twilight"${A} | Syntax highlighting theme to use when ${A}theme${A} is ${A}"dark"${A}. |

### Available Themes

We support a wide range of Prism themes. You can import ${A}prismStyleNames${A} to see the full list or use it to build a theme selector.

${C}tsx
import { prismStyleNames } from "@codearcade/mdx";

console.log(prismStyleNames);
// ["dracula", "atomDark", "nightOwl", "vs", "monokai", ...]
${C}

## License

MIT © [CodeArcade](https://github.com/codearcade-io)
`;

const ShowCase = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Markdown content={myMarkdown} theme={theme} />

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 40,
          right: 20,
          elevation: 2,
          backgroundColor: theme === "dark" ? "white" : "black",
          padding: 10,
          borderRadius: 20,
          width: 50,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
        onPress={toggleTheme}
      >
        {theme === "dark" ? (
          <AntDesign name="moon" size={24} color="black" />
        ) : (
          <AntDesign name="sun" size={24} color="white" />
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ShowCase;
