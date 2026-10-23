# ombadagi.com auth.md

How AI agents and automated clients get access to ombadagi.com.

## Audience

Any AI agent, crawler or script acting for a user who wants information about Om Badagi's engineering and Industry 4.0 consulting services.

## Registration

None. There is no agent registration or provisioning endpoint, and no account to create. Do not send `POST /agent/auth` or similar requests: they do not exist on this site.

## Supported methods

- `anonymous`: all public resources are open to unauthenticated `GET` requests.

No OAuth, OpenID Connect, API keys or identity assertions are used, so this site publishes no OAuth Protected Resource or Authorization Server metadata.

## Credential use

No credentials are issued or accepted. Send requests without an `Authorization` header. Any credentials sent are ignored.

## Resources

| Resource | URL | Access |
|---|---|---|
| Homepage (HTML, or Markdown with `Accept: text/markdown`) | https://ombadagi.com/ | anonymous |
| API catalog (RFC 9727) | https://ombadagi.com/.well-known/api-catalog | anonymous |
| OpenAPI spec | https://ombadagi.com/openapi.json | anonymous |
| Profile | https://ombadagi.com/api/v1/profile.json | anonymous, read-only |
| Health | https://ombadagi.com/api/v1/health.json | anonymous, read-only |

## Acting for a user

Agents cannot submit enquiries, book meetings or send messages through this site. To contact Om Badagi for a user, show them the address below and let them send the email themselves.

- Email: ombadagi@gmail.com
- LinkedIn: https://www.linkedin.com/in/om-badagi
