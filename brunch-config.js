module.exports = {
  paths: {
    public: '',
    watched: ['public/scss']
  },
  files: {
    stylesheets: {joinTo: 'public/css/app.css'}
  },
  plugins: {
    sass: {
      options: ['--style', 'compressed', '--no-cache']
    }
  }
};