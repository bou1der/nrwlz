const API_URL = process.env["API_URL"]
export default {
  '/api': {
    target: API_URL,
    secure: API_URL.startsWith('https'),
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/api': '',
    },
  },
};
