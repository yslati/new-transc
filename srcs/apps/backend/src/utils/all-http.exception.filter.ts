import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import * as fs from "fs";
import { CustomHttpExceptionResponse, HttpExceptionResponse } from "./http-exception.response.interface";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        let status: HttpStatus;
        let errorMsg: string;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            errorMsg = (errorResponse as HttpExceptionResponse).error || exception.message;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorMsg = 'Critical internal server error occurred!';
        }
        const errorResponse = this.getErrorResponse(status, errorMsg, req);
        const errorLog = this.getErrorLog(errorResponse, req, exception);
        this.printErrorLog(errorLog);

        response
            .status(status)
            .json(errorResponse);
    }

    private getErrorResponse = (status: HttpStatus, errorMsg: string, request: Request): CustomHttpExceptionResponse => {
        return {
            statusCode: status,
            error: errorMsg,
            path: request.url,
            method: request.method,
            timeStamp: new Date(),
        };
    }

    private getErrorLog = (errorResponse: CustomHttpExceptionResponse, request: Request, exception: unknown): string => {
        const { statusCode, error } = errorResponse;
        const { method, url } = request;
        const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n
        ${JSON.stringify(errorResponse)}\n\n
        User: ${JSON.stringify(request.user ?? 'Not signed in')}\n\n
        ${exception instanceof HttpException ? exception.stack : error}\n\n`;
        return errorLog;
    }

    private printErrorLog = (errorLog: string): void => {
        fs.writeFile('error.log', errorLog, 'utf-8', (err) => {
            if (err) throw err;
        });
    }
}
