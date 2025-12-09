# streettuner sign-in fix (Auth0 JWKS)

## Issue
- Auth0 started enforcing TLS 1.2+ and rejected HTTP JWKS fetches.
- The app was configured to load JWKS from `http://fvv.eu.auth0.com/.well-known/jwks.json`, which caused sign-in failures and `authentication-api-problem` / `no-access-token` errors after clicking the email link.

## Fix (Dec 2025)
- Update JWKS endpoint to HTTPS in `app/authentication.js`:
  - `jwksUri: 'https://fvv.eu.auth0.com/.well-known/jwks.json'`
- Rebuild/redeploy the app containers with this change.

## Deploy notes (prod)
- Container name: `fvv-streetmix`
- Network: `fvv`
- Env file: `/srv/streetmix/.env`
- Current image: `fvv-streetmix:jwksfix` (committed from the running, patched container)
- Restart policy previously `always`; current run uses `unless-stopped` (adjust as desired).
- Ports: served behind nginx; container exposes 8000/tcp internally.

### Restart recipe (using existing env file)
```bash
sudo docker rm -f fvv-streetmix
sudo docker run -d --name fvv-streetmix \
  --network fvv \
  --env-file /srv/streetmix/.env \
  --restart always \
  fvv-streetmix:jwksfix
```

## Auth0 configuration checklist
- Domain: `fvv.eu.auth0.com`
- Application type: Regular Web Application
- Grant types: Authorization Code, Refresh Token, Implicit, Passwordless OTP enabled
- Allowed Callback URLs:
  - `https://streettuner.fvv.tuwien.ac.at/services/auth/sign-in-callback`
  - (test) `http://128.130.86.80:8080/services/auth/sign-in-callback`
- Allowed Web Origins / CORS / Logout: production origin and test origin as needed
- Email connection enabled for the application

## Notes
- Twitter client warnings: safe to ignore if Twitter sign-in is unused.