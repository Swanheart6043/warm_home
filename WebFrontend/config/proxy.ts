export default {
  dev: {
    '/api': {
      target: 'http://47.119.148.125:9900',
      // target: 'http://47.116.215.74:88',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    }
  },
  test: {
    '/api/': {
      target: 'http://47.116.215.74:88',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    }
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    }
  },
};
