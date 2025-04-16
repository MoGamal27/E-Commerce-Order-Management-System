export class AppError extends Error {
    public readonly message: string;
    public readonly statusCode: number;
    public status: string;
    constructor(message: string, statusCode: number) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    }
}