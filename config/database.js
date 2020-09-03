module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        host: '***REMOVED***',
        srv: false,
        port: 27017,
        database:  'cutie',
        username:  'ajeet',
        password:  '***REMOVED***',
      },
      options: {
        ssl: env.bool('DATABASE_SSL', true),
      },
    },
  },
});
