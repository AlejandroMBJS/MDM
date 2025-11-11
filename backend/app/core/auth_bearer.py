# app/core/auth_bearer.py
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from app.core.security import decode_access_token

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            token = credentials.credentials
            try:
                payload = decode_access_token(token)
                # Guardamos la info del usuario en request.state para usarla en endpoints
                request.state.user = payload
                return credentials.credentials
            except JWTError:
                raise HTTPException(status_code=403, detail="Token inválido o expirado")
        raise HTTPException(status_code=403, detail="No autorizado")
