export interface RequestError extends Error {
    request?: {
        status: number;
    };
}
