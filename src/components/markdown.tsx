import * as Clipboard from 'expo-clipboard';
import MarkdownIt from 'markdown-it';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { WebViewMessageEvent } from 'react-native-webview';
import { WebView } from 'react-native-webview';

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

interface Props {
  content: string;
  theme?: 'light' | 'dark';
  defaultDarkTheme?: {
    backgroundColor: string;
    textColor: string;
    codeBackgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
  };
  defaultLightTheme?: {
    backgroundColor: string;
    textColor: string;
    codeBackgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
  };
}

export const Markdown: React.FC<Props> = ({
  content,
  theme = 'light',
  defaultDarkTheme = {
    backgroundColor: '#111111ff',
    textColor: '#fff',
    codeBackgroundColor: '#2d2d2d',
    primaryColor: '#326fdfff',
    secondaryColor: '#39c927ff',
  },
  defaultLightTheme = {
    backgroundColor: '#ffffffff',
    textColor: '#000',
    codeBackgroundColor: '#f3f3f3ff',
    primaryColor: '#326fdfff',
    secondaryColor: '#39c927ff',
  },
}) => {
  const activeTheme = theme === 'dark' ? defaultDarkTheme : defaultLightTheme;

  // 1. Convert Markdown to HTML String
  const htmlContent = useMemo(() => mdParser.render(content), [content]);

  // 2. Select Prism Theme (CDN URLs)
  // You can swap these URLs for any theme from the list you provided
  const prismThemeUrl =
    theme === 'dark'
      ? 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';

  // 3. Your Custom CSS (Converted to String)
  // I pasted your exact CSS here, plus some WebView specific tweaks
  const userStyles = `

  * { box-sizing: border-box; }
   
      .markdownBody {
      padding: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px; /* Body text size */
      line-height: 1.6;
      margin: 0;
      background-color: ${activeTheme.backgroundColor} !important;
      color: ${activeTheme.textColor} !important;
    }

 /* =========================
       Headings
    ========================= */
    .markdownBody h1, .markdownBody h2, .markdownBody h3, 
    .markdownBody h4, .markdownBody h5, .markdownBody h6 {
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 1rem;
      line-height: 1.25;
      color: inherit;
    }

    .markdownBody h1 { font-size: 1.875rem; padding-bottom: 0.3em; }
    .markdownBody h2 { font-size: 1.5rem; padding-bottom: 0.3em; }
    .markdownBody h3 { font-size: 1.25rem; }
    
    .markdownBody h1:first-child,
    .markdownBody h2:first-child,
    .markdownBody h3:first-child {
      margin-top: 0;
    }

    /* =========================
       Paragraphs & Links
    ========================= */
    .markdownBody p { margin-bottom: 1rem; }
    
    .markdownBody a { 
      color: ${activeTheme.primaryColor}; 
      text-decoration: none; 
    }
    .markdownBody a:hover { text-decoration: underline; }

    /* =========================
       Lists (UL, OL, LI) - Added!
    ========================= */
    .markdownBody ul, 
    .markdownBody ol {
      padding-left: 1.5rem; /* Indentation */
      margin-bottom: 1rem;
    }

    .markdownBody ul { list-style-type: disc; }
    .markdownBody ol { list-style-type: decimal; }

    .markdownBody li {
      margin-bottom: 0.25rem;
    }
    
    /* Nested Lists */
    .markdownBody li > ul,
    .markdownBody li > ol {
      margin-top: 0.25rem;
      margin-bottom: 0;
    }

    /* =========================
       Blockquotes
    ========================= */
    .markdownBody blockquote {
      border-left: 4px solid rgba(0,0,0,0.02);
      padding-left: 1rem;
      font-style: italic;
      color: rgba(0,0,0,0.5);
      margin: 1rem 0;
      margin-left: 0;
    }

    /* =========================
       Tables
    ========================= */
    .markdownBody table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
      display: block;
      overflow-x: auto;
    }

    .markdownBody th,
    .markdownBody td {
      border: 1px solid rgba(0,0,0,0.02);
      padding: 0.5rem;
      text-align: left;
    }

    .markdownBody th { font-weight: 600; background-color: rgba(0,0,0,0.02) }

    /* =========================
       Images & HR
    ========================= */
    .markdownBody img { max-width: 100%; height: auto; border-radius: 0.375rem; }
    
    .markdownBody hr {
      border: none;
      border-top: 2px solid rgba(0,0,0,0.02);
      margin: 2rem 0;
    }

    /* =========================
       Text Emphasis
    ========================= */
    .markdownBody strong { font-weight: 700; }
    .markdownBody em { font-style: italic; }
    .markdownBody del { text-decoration: line-through; opacity: 0.7; }

   .code-wrapper {
      position: relative; /* Anchor for the absolute button */
      margin: 1.5rem 0;
      border-radius: 0.5rem;
      background-color: ${activeTheme.codeBackgroundColor} !important;
      border: 1px solid ${theme === 'dark' ? '#3e3e3e' : '#e0e0e0'};
      overflow: hidden; /* Ensures rounded corners */
    }

    /* 2. The Copy Button (Stays fixed in top right of container) */
   .copy-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      background: ${
        theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
      };
      color: ${theme === 'dark' ? '#ccc' : '#666'};
      border: 1px solid ${theme === 'dark' ? '#555' : '#ddd'};
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      z-index: 10;
    }
    .copy-btn:active { transform: scale(0.95); opacity: 0.8; }
    
    /* Code Block Container */
    pre {
      background-color: ${
        theme === 'dark'
          ? defaultDarkTheme.codeBackgroundColor
          : defaultLightTheme.codeBackgroundColor
      } !important;
      color: ${
        theme === 'dark'
          ? defaultDarkTheme.textColor
          : defaultLightTheme.textColor
      } !important;
      position: relative;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
    }

    /* 4. The Code Font (Smaller & Sharper) */
    code {
      font-family: "Menlo", "Monaco", "Courier New", monospace !important;
      font-size: 13px !important;
      line-height: 1.5;
    }
    
    /* Inline code styling (not blocks) */
    p > code {
      background-color: rgba(0, 0, 0, 0.13);
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 13px; 
    }

  `;

  const htmlSource = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="${prismThemeUrl}" rel="stylesheet" />
  <style>${userStyles}</style>
</head>
<body class="markdownBody">
  ${htmlContent}

  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>

  <script>
    // 1. Add Copy Buttons to all <pre> blocks
    document.querySelectorAll('pre').forEach((pre) => {


    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

      // Create button
      const button = document.createElement('button');
      button.innerText = 'Copy';
      button.className = 'copy-btn';
      
      // Add click event
      button.addEventListener('click', () => {
        // Get code text
        const code = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
        
        // Send to React Native
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'copy',
          payload: code
        }));

        // Visual feedback
        const originalText = button.innerText;
        button.innerText = 'Copied!';
        setTimeout(() => { button.innerText = originalText; }, 2000);
      });

      wrapper.appendChild(button);

      if (window.Prism) {
      window.Prism.highlightAll();
    }
    });
  </script>
</body>
</html>
  `;

  // 5. Handle Messages from WebView (Copy to Clipboard)
  const handleMessage = async (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'copy') {
        await Clipboard.setStringAsync(data.payload);
      }
    } catch (error) {
      console.error('Error parsing webview message', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlSource }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size="large" />}
        style={{ flex: 1, backgroundColor: 'transparent' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
