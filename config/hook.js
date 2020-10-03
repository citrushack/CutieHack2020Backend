module.exports = ({ env }) => ({
  settings: {
    mailchimp: {
              enabled: true,
        token: env('MAILCHIMP'),
    },
  },
});
