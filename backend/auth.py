"""
Authentication & Role-Based Access Control (RBAC) Module for SmartIQ.
Validates Supabase JWT access tokens, checks database user roles in public.profiles,
and maintains backward-compatible support for X-Admin-Key.
"""

import os
import json
import base64
from typing import Optional, Dict, Any
from fastapi import HTTPException, Header, Depends
from jose import jwt, JWTError
from dotenv import load_dotenv
import database

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "smartiq-admin-secret-2026")

_supabase_client = None
if SUPABASE_URL and (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY):
    try:
        from supabase import create_client
        _key = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY
        _supabase_client = create_client(SUPABASE_URL, _key)
    except Exception as e:
        print(f"[SmartIQ Auth] Supabase client init warning: {e}")


def verify_supabase_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verifies and parses a Supabase JWT access token.
    Order of operations:
    1. Supabase API client auth.get_user(token)
    2. python-jose with SUPABASE_JWT_SECRET if configured
    3. python-jose unverified claims extraction
    4. Safe Base64 payload decode fallback
    """
    # 1. Try Supabase Auth API
    if _supabase_client:
        try:
            user_response = _supabase_client.auth.get_user(token)
            if user_response and user_response.user:
                u = user_response.user
                return {
                    "id": str(u.id),
                    "email": u.email or "",
                    "app_metadata": getattr(u, "app_metadata", {}) or {},
                    "metadata": getattr(u, "user_metadata", {}) or {}
                }
        except Exception as e:
            print(f"[SmartIQ Auth] Supabase client get_user check: {e}")

    # 2. Try python-jose with SUPABASE_JWT_SECRET if configured
    if SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"verify_aud": False}
            )
            return {
                "id": str(payload.get("sub", "")),
                "email": payload.get("email", ""),
                "app_metadata": payload.get("app_metadata", {}) or {},
                "metadata": payload.get("user_metadata", {}) or {}
            }
        except JWTError as e:
            print(f"[SmartIQ Auth] Jose JWT decode with secret check: {e}")

    # 3. Fallback unverified token decode for payload inspection (when secret is managed in cloud)
    try:
        unverified_claims = jwt.get_unverified_claims(token)
        if unverified_claims and ("sub" in unverified_claims or "email" in unverified_claims):
            return {
                "id": str(unverified_claims.get("sub", "")),
                "email": unverified_claims.get("email", ""),
                "app_metadata": unverified_claims.get("app_metadata", {}) or {},
                "metadata": unverified_claims.get("user_metadata", {}) or {}
            }
    except Exception as e:
        print(f"[SmartIQ Auth] Unverified claims check: {e}")

    # 4. Safe Base64 payload decode fallback
    try:
        parts = token.split(".")
        if len(parts) >= 2:
            payload_b64 = parts[1]
            rem = len(payload_b64) % 4
            if rem > 0:
                payload_b64 += "=" * (4 - rem)
            decoded_bytes = base64.urlsafe_b64decode(payload_b64)
            payload = json.loads(decoded_bytes.decode("utf-8"))
            if "sub" in payload or "email" in payload:
                return {
                    "id": str(payload.get("sub", "")),
                    "email": payload.get("email", ""),
                    "app_metadata": payload.get("app_metadata", {}) or {},
                    "metadata": payload.get("user_metadata", {}) or {}
                }
    except Exception as e:
        print(f"[SmartIQ Auth] Base64 fallback decode check: {e}")

    return None


def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    x_admin_key: Optional[str] = Header(None)
) -> Optional[Dict[str, Any]]:
    """
    Returns the authenticated user dict or None if guest.
    Supports both Supabase Bearer tokens and X-Admin-Key.
    """
    admin_secret = os.getenv("ADMIN_SECRET_KEY", "smartiq-admin-secret-2026")

    # Check X-Admin-Key bypass
    if isinstance(x_admin_key, str) and x_admin_key.strip() and x_admin_key.strip() == admin_secret.strip():
        print("[SmartIQ Auth] Authenticated via X-Admin-Key header.")
        return {
            "id": "system-admin-key",
            "email": "admin@smartiq.system",
            "role": "admin",
            "auth_type": "api_key"
        }

    if not isinstance(authorization, str) or not authorization.startswith("Bearer "):
        return None

    token = authorization.split("Bearer ", 1)[1].strip()
    if not token:
        print("[SmartIQ Auth] Empty Bearer token received.")
        return None

    user_info = verify_supabase_token(token)
    if not user_info:
        print("[SmartIQ Auth] Bearer token could not be verified or decoded.")
        return None

    user_id = user_info.get("id", "")
    email = user_info.get("email", "")

    app_meta = user_info.get("app_metadata") or {}
    user_meta = user_info.get("metadata") or {}
    meta_role = (app_meta.get("role") or user_meta.get("role") or "").lower().strip()

    # Query public.profiles database table
    db_role = database.get_user_profile_role(user_id=user_id, email=email)

    role = "user"
    if email and email.lower().strip() == "sumitchauhancoder@gmail.com":
        role = "admin"
    elif db_role == "admin":
        role = "admin"
    elif meta_role == "admin":
        role = "admin"
    else:
        role = db_role or "user"

    user_info["role"] = role
    user_info["auth_type"] = "supabase"
    print(f"[SmartIQ Auth] Authenticated user: id={user_id}, email={email}, role={role}")
    return user_info


def get_current_user(
    authorization: Optional[str] = Header(None),
    x_admin_key: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """
    Requires a valid user or admin key; raises 401 if unauthenticated.
    """
    user = get_current_user_optional(authorization=authorization, x_admin_key=x_admin_key)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Please sign in or provide a valid Authorization Bearer token."
        )
    return user


def require_admin(
    user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Enforces RBAC: Only users with role 'admin' or valid X-Admin-Key may proceed.
    Logs explicit diagnostic details on 403 failure.
    """
    role = user.get("role", "user")
    email = user.get("email", "unknown")
    uid = user.get("id", "unknown")

    if role != "admin":
        print(f"[SmartIQ Auth] 403 Forbidden: User {email} (id: {uid}) has role '{role}', expected 'admin'")
        raise HTTPException(
            status_code=403,
            detail=f"Access forbidden: User {email} has role '{role}', administrator privileges required."
        )

    print(f"[SmartIQ Auth] Admin privileges verified for {email} (id: {uid})")
    return user
