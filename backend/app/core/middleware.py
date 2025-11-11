from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import time


class AuditMiddleware(BaseHTTPMiddleware):
    """Middleware que registra las solicitudes para auditoría básica."""
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = round(time.time() - start_time, 3)
        method = request.method
        path = request.url.path
        status = response.status_code
        user_agent = request.headers.get("user-agent", "unknown")

        print(f"[AUDIT] {method} {path} - {status} ({process_time}s) | {user_agent}")
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware que añade encabezados de seguridad a todas las respuestas."""
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=(), payment=()"
        )
        return response
