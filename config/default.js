module.exports = {
  environment: {
    pro: {
      configFile: 'config/production.js',
      destination: 'dist/'
    },
    dev: {
      configFile: 'config/dev.js',
      destination: 'dev/'
    }
  },
  source: 'src/',
  app: {
    name: 'app.js',
    source: 'src/js/app.js',
    destination: 'js/'
  }
}
