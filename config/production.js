module.exports = {
  app_host_port: 'streetmix.tuwien.ac.at',
  header_host_port: 'streetmix.tuwien.ac.at',
  restapi: {
    protocol: 'https://',
    baseuri: '/api'
  },
  facebook_app_id: '162729607241489',
  google_analytics_account: 'UA-38087461-1',
  // Temporarily disable mixpanel
  // mixpanel_token: '61e4b1fdd39e00551df8911fe62b8c56',
  pinterest: '0175a0c658a16a45e7c1f6b7cefaa34f',
  db: {
    sequelize: {
      logging: false,
      pool: {
        max: 12,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  },
  l10n: {
    use_local: true
  },
  stripe: {
    tier1_plan_id: process.env.TIER1_PLAN_ID || 'plan_Fc2wCyqj2Azpbm'
  }
}
