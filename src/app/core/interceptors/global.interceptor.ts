import { HttpEvent, HttpRequest } from '@angular/common/http';
import { HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export function headersInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem('access_token');
  req = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Accept-Language': localStorage.getItem('lang') || 'ar',
    },
  });
  return next(req);
}
