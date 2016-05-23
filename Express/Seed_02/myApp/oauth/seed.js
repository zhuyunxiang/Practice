var app = require('../app');
var models = require('./index');

models.User.create({
  email: 'luqh@snail.com',
  hashed_password: '$2a$10$aZB36UooZpL.fAgbQVN/j.pfZVVvkHxEnj7vfkVSqwBOBZbB/IAAK'
}, function() {
  models.OAuthClientsModel.create({
    clientId: 'papers3',
    clientSecret: '123',
    redirectUri: '/oauth/redirect'
  }, function() {
    process.exit();
  });
});
