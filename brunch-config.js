module.exports = {
  paths: {
    public: '',
    watched: ['public/scss']
  },
  files: {
    stylesheets: {joinTo: 'public/css/main.css'}
  },
  plugins: {
    sass: {
      options: ['--style', 'compressed', '--no-cache']
    },
    postcss: {
      processors: [
        require('autoprefixer')(['last 4 versions'])
      ]
    }
  }
};