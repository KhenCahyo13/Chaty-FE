export interface ApiResponse<TData, TMeta = null, TError = null> {
    success: boolean;
    message: string;
    data: TData;
    meta?: TMeta;
    errors?: TError;
}

export interface CursorMeta {
    nextCursor: string | null;
}
