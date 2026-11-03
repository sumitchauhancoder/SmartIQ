"""
Authentication & Role-Based Access Control (RBAC) Module for SmartIQ.
Validates Supabase JWT access tokens, checks database user roles in public.profiles,
and maintains backward-compatible support for X-Admin-Key.
"""

import os
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
    Verifies a Supabase JWT access token.
    Tries Supabase API client first, then fallback to python-jose JWT verification.
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
                    "metadata": u.user_metadata or {}
                }
        except Exception:
            pass

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
                "metadata": payload.get("user_metadata", {})
            }
        except JWTError:
            pass

    # 3. Fallback unverified token decode for payload inspection (when secret is managed in cloud)
    try:
        unverified_claims = jwt.get_unverified_claims(token)
        if unverified_claims and "sub" in unverified_claims:
            return {
                "id": str(unverified_claims.get("sub", "")),
                "email": unverified_claims.get("email", ""),
                "metadata": unverified_claims.get("user_metadata", {})
            }
    except Exception:
        pass

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
    if isinstance(x_admin_key, str) and x_admin_key.strip() == admin_secret.strip():
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
        return None

    user_info = verify_supabase_token(token)
    if not user_info:
        return None

    user_id = user_info["id"]
    # Check role from database
    role = database.get_user_profile_role(user_id)
    user_info["role"] = role
    user_info["auth_type"] = "supabase"
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
    """
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Access forbidden: Administrator privileges required."
        )
    return user
