package com.tns.gen.com.twitter.sdk.android.core;

public class Callback_ftns_modules_nativescript_twitter_src_android_twitter_l87_c57__ extends com.twitter.sdk.android.core.Callback implements com.tns.NativeScriptHashCodeProvider {
	public Callback_ftns_modules_nativescript_twitter_src_android_twitter_l87_c57__(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public void success(com.twitter.sdk.android.core.Result param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "success", void.class, args);
	}

	public void failure(com.twitter.sdk.android.core.TwitterException param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "failure", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
