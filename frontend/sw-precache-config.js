module.exports = {
    staticFileGlobs: [
        'build/static/css/**.css',
        'build/static/js/**.js',
        'build/**.png',
        'build/**.json',
        'build/**.ico',
        'build/**.html'
    ],
    swFilePath: './build/service-worker.js',
    templateFilePath: './service-worker.tmpl',
    stripPrefix: 'build/',
    handleFetch: false,
    runtimeCaching: [{
        urlPattern: /this\\.is\\.a\\.regex/,
        handler: 'cacheFirst'
    }]
}