module.exports = {
  assetsDir: 'static',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
  },
  "pwa": {
    "themeColor": "#4DBA87",
    "workboxOptions": {
      "runtimeCaching": [
        {
          "urlPattern": new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
          "handler": "cacheFirst",
          "options": {
            "cacheName": "google-fonts",
            "expiration": {
              "maxEntries": 30
            },
            "cacheableResponse": {
              "statuses": [
                0,
                200
              ]
            }
          }
        }
      ]
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}