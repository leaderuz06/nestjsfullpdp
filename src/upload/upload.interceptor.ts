import { CallHandler, ExecutionContext, Injectable, mixin, NestInterceptor, Type } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Observable } from "rxjs";


export function UploadInterceptor(folder: string): Type<NestInterceptor>{
    @Injectable()
    class UploadInterceptor implements NestInterceptor{
        private interceptor;
        constructor(private uploadService: UploadService){
            this.interceptor = new (FileInterceptor('image', this.uploadService.createMulterOptions(folder)))();
        }

        intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
            return this.interceptor.intercept(context, next)
        }
    }

    return mixin(UploadInterceptor);
}