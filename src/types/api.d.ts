export interface ApiResponse<TData, TMeta = null, TError = null> {
    data: TData;
    errors?: TError;
    message: string;
    meta?: TMeta;
    success: boolean;
}

export interface CursorMeta {
    nextCursor: null | string;
}
