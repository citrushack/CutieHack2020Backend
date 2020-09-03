module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        host: '',
        srv: false,
        port: 27017,
        database:  'cutie',
        username:  'ajeet',
        password:  '',
      },
      options: {
        ssl: env.bool('DATABASE_SSL', true),
      },
    },
  },
});
