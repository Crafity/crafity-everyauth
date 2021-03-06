var oauthModule = require('./oauth2');

module.exports =
  oauthModule.submodule('angellist')
    .configurable({
      scope: 'specify types of access: (no scope), user, public_repo, repo, gist'
    })

    .oauthHost('https://angel.co')
    .apiHost('https://api.angel.co/1')

    .authPath('/api/oauth/authorize')
    .authQueryParam('response_type', 'code')

    .accessTokenPath('/api/oauth/token')
    .accessTokenParam('grant_type', 'authorization_code')

    .entryPath('/auth/angellist')
    .callbackPath('/auth/angellist/callback')

    .fetchOAuthUser(function (accessToken) {
      var p = this.Promise();
      this.oauth.get(this.apiHost() + '/me.json', accessToken, function (err, data) {
        if (err) return p.fail(err);
        console.log(data);
        var oauthUser = JSON.parse(data).user;
        p.fulfill(oauthUser);
      })
      return p;
    })

    .convertErr(function (err) {
      console.log(err);
      if (err.error_description)
        return new Error(err.error_description);
      return new Error(JSON.parse(err.data).error.message);
    });
