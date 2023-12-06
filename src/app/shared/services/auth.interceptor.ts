import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthorizationService } from "./authorization.service";

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {

  constructor (
    private _service: AuthorizationService,
  ) {
  }

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;
    request = this._addBearerToken(request);
    return next.handle(request);
  }

  private _addBearerToken (req: HttpRequest<any>): HttpRequest<any> {
    console.log('addBearerToken');
    let request = req;
    const token = (this._service.client as any)._accessToken;
    if (token !== null) {
      const headers = request.headers.set('Authorization', token);
      request = req.clone({ headers });
    }

    return request;
  }
}
