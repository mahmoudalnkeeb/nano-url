# Nano-URL

**Nano-URL** is a simple URL shortener built using Node.js, Express.js, and MongoDB. It allows users to shorten long URLs into more manageable, compact versions.

## Problem Solved

Long URLs can be difficult to share, remember, or fit into certain formats, such as messages or social media posts with character limits. **Nano-URL** provides a solution by generating shortened versions of URLs, which users can share easily.

## Features

- Shorten long URLs into compact versions
- Redirect shortened URLs to their original destination
- Basic error handling and validation for valid URLs

### Future Features

- **URL Insights:** Track the number of clicks on each shortened URL to provide usage insights.

## Technologies

- Node.js
- Express.js
- MongoDB

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/nano-url.git
   cd nano-url
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file and add your environment variables:

   ```bash
   DB_URI=your-mongodb-uri
   PORT=your-port
   ORIGIN=your-allowed-origin
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## License

This project is licensed under the [MIT](LICENSE) License.
