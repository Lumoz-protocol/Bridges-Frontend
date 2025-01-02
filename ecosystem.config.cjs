module.exports = {
  apps: [
    {
      name: 'uxlink-bridge',
      script: './.output/server/index.mjs',
      env: {
        NUXT_HOST: '0.0.0.0',
        PORT: 10081
      }
    }
  ]
}
