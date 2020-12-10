module.exports = {
  publicPath: '/',
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/assets/sass/_global.scss";`,
      },
    },
  },
  pluginOptions: {
    i18n: {
      locale: 'tr',
      fallbackLocale: 'tr',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
  devServer: {
    disableHostCheck: true,
  },
};
