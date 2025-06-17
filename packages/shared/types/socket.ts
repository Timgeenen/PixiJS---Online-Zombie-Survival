export type SocketCallback = (...args: any[]) => void;
export type SocketResponse<T> = SocketErrorResponse | SocketSuccessResponse<T>;
export interface SocketErrorResponse {
    success: false;
    message: string;
}
export interface SocketSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}
