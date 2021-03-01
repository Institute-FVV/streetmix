module.exports = {
  app_host_port: 'streettuner.fvv.tuwien.ac.at',
  header_host_port: 'streettuner.fvv.tuwien.ac.at',
  protocol: 'https://',
  restapi: {
    protocol: 'http://',
    baseuri: '/api'
  },
  facebook_app_id: '',
  plausible: {
    domain: 'streetmix.net'
  },
  pinterest: '',
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
