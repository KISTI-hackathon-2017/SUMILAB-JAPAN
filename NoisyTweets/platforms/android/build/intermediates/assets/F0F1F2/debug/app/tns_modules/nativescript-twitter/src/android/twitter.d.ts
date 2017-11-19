import { View } from "ui/core/view";
export declare class TNSTwitter {
    static init(key: string, secret: string): void;
    static getCurrentUserEmail(): Promise<any>;
    static getCurrentUser(userID: string): Promise<any>;
    static getNativeConfig(): any;
    static getNativeToken(): any;
}
export declare class TNSTwitterButton extends View {
    private _android;
    readonly android: any;
    createNativeView(): any;
    initNativeView(): void;
}
export declare class CustomApiService {
    private _config;
    private _token;
    constructor();
    makeRequest(url: any, method: any, options?: any): Promise<any>;
    private buildOptions(value);
}
