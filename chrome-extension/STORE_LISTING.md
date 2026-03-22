# Chrome Web Store Listing — UtilShed Toolbox

## Title
UtilShed Toolbox — 10 Developer Tools

## Short Description (132 chars max)
10 essential dev tools in your toolbar: JSON formatter, Base64, UUID generator, JWT decoder, hash generator, color converter & more.

## Detailed Description
UtilShed Toolbox puts 10 essential developer tools right in your browser toolbar. No tabs to open, no signup, no tracking.

TOOLS INCLUDED:
- JSON Formatter & Validator — format, minify, and validate JSON
- Base64 Encode/Decode — convert text to/from Base64
- URL Encode/Decode — encode/decode URL components
- UUID Generator — generate single or bulk UUIDs (v4)
- Hash Generator — SHA-256, SHA-1, SHA-512 hashing
- JWT Decoder — decode and inspect JWT tokens with expiration checking
- Color Converter — convert between HEX, RGB, and HSL with color picker
- Timestamp Converter — convert Unix timestamps to human dates and vice versa
- Text Case Converter — UPPER, lower, Title, Sentence, camelCase, snake_case
- Lorem Ipsum Generator — generate placeholder text paragraphs

WHY UTILSHED TOOLBOX?
- Zero permissions required — we don't access your browsing data
- Everything runs locally in your browser — no data sent anywhere
- Dark theme, compact UI designed for developer workflows
- Free and open source

Visit utilshed.com for 70+ more free developer tools.

## Category
Developer Tools

## Language
English

## Privacy
This extension requires ZERO permissions. All processing happens locally in the popup. No data is collected, stored, or transmitted. No cookies, no tracking, no analytics.

## How to Publish

1. Go to https://chrome.google.com/webstore/devconsole
2. Pay one-time $5 developer registration fee (requires Google account)
3. Click "New Item"
4. Upload a ZIP of the chrome-extension/ directory (excluding this file, node_modules)
5. Fill in the listing details from above
6. Upload screenshots (1280x800 or 640x400)
7. Submit for review (usually 1-3 business days)

## ZIP Command
```bash
cd chrome-extension && zip -r ../utilshed-toolbox.zip . -x "STORE_LISTING.md" -x "node_modules/*" -x ".DS_Store"
```
