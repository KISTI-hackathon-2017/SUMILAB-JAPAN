"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("utils/utils");
var app = require("application");
var view_1 = require("ui/core/view");
var observable_1 = require("data/observable");
var http = require("http");
var TNSTwitter = (function () {
    function TNSTwitter() {
    }
    TNSTwitter.init = function (key, secret) {
        var config = new com.twitter.sdk.android.core.TwitterConfig.Builder(utils.ad.getApplicationContext())
            .twitterAuthConfig(new com.twitter.sdk.android.core.TwitterAuthConfig(key, secret))
            .build();
        com.twitter.sdk.android.core.Twitter.initialize(config);
    };
    TNSTwitter.getCurrentUserEmail = function () {
        return new Promise(function (resolve, reject) {
            var session = com.twitter.sdk.android.core.TwitterCore.getInstance().getSessionManager().getActiveSession();
            var client = new com.twitter.sdk.android.core.identity.TwitterAuthClient();
            client.requestEmail(session, new com.twitter.sdk.android.core.Callback({
                success: function (result) {
                    if (result.data && result.data.length > 0) {
                        resolve(result.data);
                    }
                    else {
                        reject({ "message": "This user does not have an email address." });
                    }
                }, failure: function (exception) {
                    reject({ message: exception.getMessage() });
                }
            }));
        });
    };
    TNSTwitter.getCurrentUser = function (userID) {
        return new Promise(function (resolve, reject) {
            var api = new CustomApiService();
            api.makeRequest("https://api.twitter.com/1.1/account/verify_credentials.json", "get")
                .then(function (data) {
                var user = data.content.toJSON();
                ;
                resolve({
                    formattedScreenName: user.screen_name,
                    isProtected: user.protected,
                    isVerified: user.verified,
                    name: user.name,
                    profileImageLargeURL: user.profile_image_url_https.replace('_normal', '_bigger'),
                    profileImageMiniURL: user.profile_image_url_https.replace('_normal', '_mini'),
                    profileImageURL: user.profile_image_url_https,
                    profileURL: user.url,
                    screenName: user.screen_name,
                    userID: user.id
                });
            }, function (err) {
                reject(err.message);
            });
        });
    };
    TNSTwitter.getNativeConfig = function () {
        return com.twitter.sdk.android.core.TwitterCore.getInstance().getAuthConfig();
    };
    TNSTwitter.getNativeToken = function () {
        return com.twitter.sdk.android.core.TwitterCore.getInstance().getSessionManager().getActiveSession() ? com.twitter.sdk.android.core.TwitterCore.getInstance().getSessionManager().getActiveSession().getAuthToken() : null;
    };
    return TNSTwitter;
}());
exports.TNSTwitter = TNSTwitter;
var TNSTwitterButton = (function (_super) {
    __extends(TNSTwitterButton, _super);
    function TNSTwitterButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TNSTwitterButton.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    TNSTwitterButton.prototype.createNativeView = function () {
        this._android = new com.twitter.sdk.android.core.identity.TwitterLoginButton(app.android.foregroundActivity);
        return this._android;
    };
    TNSTwitterButton.prototype.initNativeView = function () {
        var _this = this;
        var that = new WeakRef(this);
        var _cb = com.twitter.sdk.android.core.Callback.extend({
            owner: that.get(),
            success: function (result) {
                this.owner.notify({
                    eventName: 'loginStatus',
                    object: observable_1.fromObject({ value: 'success', userName: result.data.getUserName(), userID: result.data.getUserId() })
                });
            },
            failure: function (exception) {
                this.owner.notify({
                    eventName: 'loginStatus',
                    object: observable_1.fromObject({ value: 'failed', message: exception.getMessage() })
                });
            }
        });
        this._android.setCallback(new _cb());
        app.android.on(app.AndroidApplication.activityResultEvent, function (args) {
            _this._android.onActivityResult(args.requestCode, args.resultCode, args.intent);
        });
    };
    return TNSTwitterButton;
}(view_1.View));
exports.TNSTwitterButton = TNSTwitterButton;
var CustomApiService = (function () {
    function CustomApiService() {
        this._config = TNSTwitter.getNativeConfig();
        this._token = TNSTwitter.getNativeToken();
    }
    CustomApiService.prototype.makeRequest = function (url, method, options) {
        if (this._config && this._token) {
            try {
                var oauth = new com.twitter.sdk.android.core.OAuthSigning(this._config, this._token);
                var auth = oauth.getAuthorizationHeader(method, url, options ? this.buildOptions(options) : null);
                return http.request({
                    url: url,
                    method: method,
                    headers: {
                        'Authorization': auth
                    }
                });
            }
            catch (ex) {
                return new Promise(function (resolve, reject) {
                    reject(ex);
                });
            }
        }
        else {
            return new Promise(function (resolve, reject) {
                reject('User is not logged in');
            });
        }
    };
    CustomApiService.prototype.buildOptions = function (value) {
        var store = new java.util.HashMap();
        Object.keys(value).forEach(function (item, key) {
            switch (typeof value[item]) {
                case 'string':
                    store.put(item, value[item]);
                    break;
                case 'boolean':
                    store.put(item, new java.lang.String(String(value[item])));
                    break;
                case 'number':
                    store.put(item, value[item]);
                    break;
            }
        });
        return store;
    };
    return CustomApiService;
}());
exports.CustomApiService = CustomApiService;
