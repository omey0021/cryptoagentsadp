module.exports = {
  apps: [
    {
      name: 'cryptoagentsadp',
      script: 'backend/src/server.js',
      cwd: '/var/www/cryptoagentsadp',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/cryptoagentsadp-error.log',
      out_file: '/var/log/pm2/cryptoagentsadp-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_restarts: 10,
      restart_delay: 4000,
      min_uptime: '10s',
      watch: false,
    },
  ],
};