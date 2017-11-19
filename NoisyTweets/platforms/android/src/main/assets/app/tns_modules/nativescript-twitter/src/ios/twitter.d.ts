import { View } from "ui/core/view";
export declare class TNSTwitter {
    static init(key: string, secret: string): void;
    static getCurrentUserEmail(): Promise<any>;
    static getCurrentUser(userID: string): Promise<any>;
}
export declare class TNSTwitterButton extends View {
    private _ios;
    readonly ios: any;
    createNativeView(): any;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
}
export declare class CustomApiService {
    private _config;
    private _token;
    constructor();
    makeRequest(url: any, method: any, options?: any): Promise<any>;
    toJsObject: (objCObj: any) => any;
}
