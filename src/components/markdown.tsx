import * as Clipboard from 'expo-clipboard';
import MarkdownIt from 'markdown-it';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
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
  containerStyle?: ViewStyle;
}

export const Markdown: React.FC<Props> = ({
  content,
  theme = 'light',
  defaultDarkTheme = {
    backgroundColor: '#111111',
    textColor: '#fff',
    codeBackgroundColor: '#2d2d2d',
    primaryColor: '#326fdfff',
    secondaryColor: '#39c927ff',
  },
  defaultLightTheme = {
    backgroundColor: '#ffffff',
    textColor: '#000',
    codeBackgroundColor: '#f3f3f3',
    primaryColor: '#326fdfff',
    secondaryColor: '#39c927ff',
  },
  containerStyle,
}) => {
  const activeTheme = theme === 'dark' ? defaultDarkTheme : defaultLightTheme;

  // 1. Convert Markdown to HTML String
  const htmlContent = useMemo(() => mdParser.render(content), [content]);

  // 2. Select Prism Theme (CDN URLs)
  const prismThemeUrl =
    theme === 'dark'
      ? 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';

  // 3. CSS Styles
  const userStyles = `
    * { box-sizing: border-box; }
    
    .markdownBody {
      padding: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
      background-color: ${activeTheme.backgroundColor} !important;
      color: ${activeTheme.textColor} !important;
    }

    /* Headings */
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
    
    .markdownBody h1:first-child,
    .markdownBody h2:first-child,
    .markdownBody h3:first-child { margin-top: 0; }

    /* Standard Elements */
    .markdownBody p { margin-bottom: 1rem; }
    
    .markdownBody a { 
      color: ${activeTheme.primaryColor}; 
      text-decoration: none; 
    }
    .markdownBody a:hover { text-decoration: underline; }

    .markdownBody ul, .markdownBody ol {
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }
    .markdownBody ul { list-style-type: disc; }
    .markdownBody ol { list-style-type: decimal; }
    .markdownBody li { margin-bottom: 0.25rem; }

    .markdownBody blockquote {
      border-left: 4px solid rgba(125,125,125,0.3);
      padding-left: 1rem;
      font-style: italic;
      color: ${theme === 'dark' ? '#aaa' : '#666'};
      margin: 1rem 0;
    }

    .markdownBody img { max-width: 100%; height: auto; border-radius: 0.375rem; }
    
    .markdownBody hr {
      border: none;
      border-top: 2px solid ${theme === 'dark' ? '#333' : '#eee'};
      margin: 2rem 0;
    }

    /* Code Block Wrapper */
    .code-wrapper {
      position: relative;
      margin: 1.5rem 0;
      border-radius: 0.5rem;
      background-color: ${activeTheme.codeBackgroundColor} !important;
      border: 1px solid ${theme === 'dark' ? '#3e3e3e' : '#e0e0e0'};
      overflow: hidden;
    }

    /* Copy Button */
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
      transition: all 0.2s;
    }
    .copy-btn:active { transform: scale(0.95); opacity: 0.8; }

    /* Prism Pre/Code overrides */
    pre {
      background-color: transparent !important;
      margin: 0 !important;
      padding: 1rem !important;
      border-radius: 0;
      text-shadow: none !important;
    }
    
    code {
      font-family: "Menlo", "Monaco", "Courier New", monospace !important;
      font-size: 13px !important;
      line-height: 1.5;
      text-shadow: none !important;
    }

    /* Inline Code */
    p > code, li > code {
      background-color: ${
        theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
      };
      padding: 2px 4px;
      border-radius: 4px;
      color: ${activeTheme.primaryColor};
    }
  `;

  // 4. HTML Source with Injected Script
  const htmlSource = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link href="${prismThemeUrl}" rel="stylesheet" />
  <style>${userStyles}</style>
</head>
<body class="markdownBody">
  ${htmlContent}

  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>

  <script>
    document.addEventListener("DOMContentLoaded", function() {

    const pres = document.querySelectorAll('pre');

      // 1. Wrap <pre> tags and add buttons
      pres.forEach((pre) => {

      if (pre.parentNode.classList.contains('code-wrapper')) {
            return;
        }
        
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';

        // Insert wrapper before pre, then move pre inside wrapper
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        // Create Copy Button
        const button = document.createElement('button');
        button.innerText = 'Copy';
        button.className = 'copy-btn';
        
        button.addEventListener('click', () => {
          // Get Raw Text (textContent is safer than innerText for code)
          const codeBlock = pre.querySelector('code') || pre;
          const codeText = codeBlock.textContent;
          
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'copy',
              payload: codeText
            }));
            
            // UI Feedback
            const originalText = button.innerText;
            button.innerText = 'Copied!';
            setTimeout(() => { button.innerText = originalText; }, 2000);
          }
        });

        wrapper.appendChild(button);
      });

      // 2. Trigger Highlight *after* DOM manipulation
      if (window.Prism) {
        window.Prism.highlightAll();
      }
    });
  </script>
</body>
</html>
  `;

  // 5. Handle Messages from WebView
  const handleMessage = async (event: WebViewMessageEvent) => {
    try {
      if (!event.nativeEvent.data) return;
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'copy' && data.payload) {
        await Clipboard.setStringAsync(data.payload);
      }
    } catch (error) {
      // Ignore non-JSON messages (internal logs etc.)
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlSource }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator size="small" color={activeTheme.primaryColor} />
        )}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        // Important for Android text selection
        overScrollMode="never"
        androidLayerType="hardware"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1, // Ensure the WebView expands
  },
});
