import { SuccessData } from '@interface/api/types.ts';
import { ISuccessResponse } from '@interface/api/responses.ts';

class Success {
    private _statusCode: number = 200;
    private _message: string = "success";
    private _data: SuccessData;

    constructor(data: SuccessData = null) {
        this._data = data;
    }

    public statusCode(statusCode: number) {
        this._statusCode = statusCode;
        return this;
    }

    public message(message: string) {
        this._message = message;
        return this;
    }

    get toJson(): ISuccessResponse {
        return {
            status: this._statusCode,
            message: this._message,
            data: this._data
        }
    }
}

export default Success;