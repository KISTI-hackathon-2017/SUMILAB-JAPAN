"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("ui/core/view");
var observable_1 = require("data/observable");
var types = require("utils/types");
var utils = require("utils/utils");
var TNSTwitter = (function () {
    function TNSTwitter() {
    }
    TNSTwitter.init = function (key, secret) {
    };
    TNSTwitter.getCurrentUserEmail = function () {
        return new Promise(function (resolve, reject) {
            var client = TWTRAPIClient.clientWithCurrentUser();
            client.requestEmailForCurrentUser(function (email, error) {
                if (error) {
                    reject({ message: error.localizedDescription });
                }
                else {
                    resolve(email);
                }
            });
        });
    };
    TNSTwitter.getCurrentUser = function (userID) {
        return new Promise(function (resolve, reject) {
            var client = TWTRAPIClient.clientWithCurrentUser();
            client.loadUserWithIDCompletion(userID, function (user, error) {
                if (error) {
                    reject({ message: error.localizedDescription });
                }
                else {
                    resolve({
                        formattedScreenName: user.formattedScreenName,
                        isProtected: user.isProtected,
                        isVerified: user.isVerified,
                        name: user.name,
                        profileImageLargeURL: user.profileImageLargeURL,
                        profileImageMiniURL: user.profileImageMiniURL,
                        profileImageURL: user.profileImageURL,
                        profileURL: user.profileURL,
                        screenName: user.screenName,
                        userID: user.userID
                    });
                }
            });
        });
    };
    return TNSTwitter;
}());
exports.TNSTwitter = TNSTwitter;
var TNSTwitterButton = (function (_super) {
    __extends(TNSTwitterButton, _super);
    function TNSTwitterButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TNSTwitterButton.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    TNSTwitterButton.prototype.createNativeView = function () {
        var _this = this;
        this._ios = TWTRLogInButton.buttonWithLogInCompletion(function (session, error) {
            if (error) {
                _this.notify({
                    eventName: 'loginStatus',
                    object: observable_1.fromObject({ value: 'failed' })
                });
            }
            else {
                _this.notify({
                    eventName: 'loginStatus',
                    object: observable_1.fromObject({ value: 'success', userName: session.userName, userID: session.userID })
                });
            }
        });
        return this._ios;
    };
    TNSTwitterButton.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = view_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var height = view_1.layout.getMeasureSpecSize(heightMeasureSpec);
        this.setMeasuredDimension(width, height);
    };
    return TNSTwitterButton;
}(view_1.View));
exports.TNSTwitterButton = TNSTwitterButton;
var CustomApiService = (function () {
    function CustomApiService() {
        this.toJsObject = function (objCObj) {
            if (objCObj === null || typeof objCObj != "object") {
                return objCObj;
            }
            var node, key, i, l, oKeyArr = objCObj.allKeys;
            if (oKeyArr === undefined) {
                // array
                node = [];
                for (i = 0, l = objCObj.count; i < l; i++) {
                    key = objCObj.objectAtIndex(i);
                    node.push(this.toJsObject(key));
                }
            }
            else {
                // object
                node = {};
                for (i = 0, l = oKeyArr.count; i < l; i++) {
                    key = oKeyArr.objectAtIndex(i);
                    var val = objCObj.valueForKey(key);
                    if (val) {
                        switch (types.getClass(val)) {
                            case 'NSArray':
                            case 'NSMutableArray':
                                node[key] = this.toJsObject(val);
                                break;
                            case 'NSDictionary':
                            case 'NSMutableDictionary':
                                node[key] = this.toJsObject(val);
                                break;
                            case 'String':
                                node[key] = String(val);
                                break;
                            case 'Boolean':
                                node[key] = Boolean(val);
                                break;
                            case 'Number':
                                node[key] = Number(String(val));
                                break;
                        }
                    }
                }
            }
            return node;
        };
        this._config = utils.ios.getter(Twitter, Twitter.sharedInstance).authConfig;
        this._token = utils.ios.getter(Twitter, Twitter.sharedInstance).sessionStore.session();
    }
    CustomApiService.prototype.makeRequest = function (url, method, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var nsError;
            var client = TWTRAPIClient.clientWithCurrentUser();
            var request = client.URLRequestWithMethodURLParametersError(method, url, null, nsError);
            if (request) {
                client.sendTwitterRequestCompletion(request, function (res, data, error) {
                    if (data) {
                        var json = NSJSONSerialization.JSONObjectWithDataOptionsError(data, 0);
                        resolve(_this.toJsObject(json));
                    }
                    else {
                        reject({ message: error.localizedDescription });
                    }
                });
            }
            else {
                reject({ message: nsError.localizedDescription });
            }
        });
    };
    return CustomApiService;
}());
exports.CustomApiService = CustomApiService;
