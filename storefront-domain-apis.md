# Storefront Domain APIs

Base URL: `/storefront/domain/`

These APIs are for adding and activating a custom storefront domain, not a storefront subdomain.

Authentication: authenticated company user with access to the company/domain.

## Frontend Flow
- Use **Add Domain** to submit the customer's root domain, for example `example.com`.
- After a successful add, show the domain as pending until `cloudflare_status` becomes `active`.
- Immediately show the `nameservers` returned by the add-domain response.
- Tell the user to go to their domain registrar and replace their current domain nameservers with the two nameservers returned by the API.
- After the user updates the nameservers, provide a **Check Status** action that calls the sync-status API.
- Activation is complete when `cloudflare_status` is `active` and `activated_at` is not `null`.

Suggested frontend message after adding a domain:

```text
Your domain was added successfully, but it is not active yet.

To activate it, open your domain registrar/DNS provider and replace your domain's current nameservers with these Cloudflare nameservers:

1. {nameservers[0]}
2. {nameservers[1]}

After saving the nameservers, click Check Status. DNS changes can take time to propagate.
```

## Domain Object Fields
- `id` (integer) - storefront domain id
- `company` (integer) - company id
- `domain` (string) - custom domain, stored lowercase
- `cloudflare_zone_id` (string/null) - Cloudflare zone id
- `cloudflare_status` (string) - usually `pending` until nameservers are active, then `active`
- `nameservers` (array of strings) - nameservers the user must add at their domain registrar
- `activated_at` (datetime/null) - set when the domain becomes active
- `created_at` (datetime)
- `updated_at` (datetime)

---

## 1) Add Storefront Domain
- **Method:** POST
- **URL:** `/storefront/domain/onboard/{company_id}`
- **Auth:** authenticated company user with access to `company_id`

### Path Params
- `company_id` (integer, required) - company id

### Payload Structure
- `domain` (string, required) - root domain only, for example `example.com`

### Example Request
```http
POST /storefront/domain/onboard/1300
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "domain": "example.com"
}
```

### Example Response (201)
```json
{
  "id": 44,
  "company": 1300,
  "domain": "example.com",
  "cloudflare_zone_id": "8f1a2b3c4d5e6f7890123456789abcde",
  "cloudflare_status": "pending",
  "nameservers": [
    "alice.ns.cloudflare.com",
    "bob.ns.cloudflare.com"
  ],
  "activated_at": null,
  "created_at": "2026-05-31T10:15:00Z",
  "updated_at": "2026-05-31T10:15:00Z"
}
```

### Frontend Handling
- Save `id` as `domain_id` for future sync-status calls.
- Display `domain`, `cloudflare_status` as status, and both `nameservers`.
- Show a pending/activation-required state while `cloudflare_status` is not `active`.
- Do not ask the user to add A records manually. The backend creates default `A` records for `@` and `www`.
- The user only needs to update the domain nameservers at their registrar.

### Example Errors
**400 Missing domain**
```json
{
  "detail": "Domain is required."
}
```

**400 Cloudflare or validation error**
```json
{
  "detail": "zone already exists"
}
```

**404 Company not found**
```json
{
  "detail": "Company not found."
}
```

---

## 2) Sync Domain Status
- **Method:** POST
- **URL:** `/storefront/domain/sync-status/{domain_id}`
- **Auth:** authenticated company user with access to the domain's company

Use this API when the user clicks **Check Status** after updating the nameservers at their registrar.

### Path Params
- `domain_id` (integer, required) - storefront domain id returned by the add-domain API

### Example Request
```http
POST /storefront/domain/sync-status/44
Authorization: Bearer <access_token>
```

### Example Response - Still Pending (200)
```json
{
  "id": 44,
  "company": 1300,
  "domain": "example.com",
  "cloudflare_zone_id": "8f1a2b3c4d5e6f7890123456789abcde",
  "cloudflare_status": "pending",
  "nameservers": [
    "alice.ns.cloudflare.com",
    "bob.ns.cloudflare.com"
  ],
  "activated_at": null,
  "created_at": "2026-05-31T10:15:00Z",
  "updated_at": "2026-05-31T10:35:00Z"
}
```

### Example Response - Active (200)
```json
{
  "id": 44,
  "company": 1300,
  "domain": "example.com",
  "cloudflare_zone_id": "8f1a2b3c4d5e6f7890123456789abcde",
  "cloudflare_status": "active",
  "nameservers": [
    "alice.ns.cloudflare.com",
    "bob.ns.cloudflare.com"
  ],
  "activated_at": "2026-05-31T11:20:00Z",
  "created_at": "2026-05-31T10:15:00Z",
  "updated_at": "2026-05-31T11:20:00Z"
}
```

### Frontend Handling
- If `cloudflare_status` is `active`, show the domain as active/connected.
- If `cloudflare_status` is still `pending`, keep showing the nameserver instructions and allow the user to check again later.
- Keep the action manual or rate-limited because DNS propagation may take time.

### Example Errors
**403 Forbidden**
```json
{
  "detail": "You do not have permission to perform this action."
}
```

**404 Domain not found**
```json
{
  "detail": "Domain not found."
}
```

**400 Cloudflare sync error**
```json
{
  "detail": "Authentication error"
}
```

---

## 3) Get All Storefront Domains of Company
- **Method:** GET
- **URL:** `/storefront/domain/get-all/{company_id}`
- **Auth:** authenticated company user with access to `company_id`

Use this API to populate the company's domain settings page.

### Path Params
- `company_id` (integer, required) - company id

### Example Request
```http
GET /storefront/domain/get-all/1300
Authorization: Bearer <access_token>
```

### Example Response (200)
```json
[
  {
    "id": 44,
    "company": 1300,
    "domain": "example.com",
    "cloudflare_zone_id": "8f1a2b3c4d5e6f7890123456789abcde",
    "cloudflare_status": "active",
    "nameservers": [
      "alice.ns.cloudflare.com",
      "bob.ns.cloudflare.com"
    ],
    "activated_at": "2026-05-31T11:20:00Z",
    "created_at": "2026-05-31T10:15:00Z",
    "updated_at": "2026-05-31T11:20:00Z"
  },
  {
    "id": 45,
    "company": 1300,
    "domain": "new-domain.com",
    "cloudflare_zone_id": "1a2b3c4d5e6f7890123456789abcdef0",
    "cloudflare_status": "pending",
    "nameservers": [
      "maya.ns.cloudflare.com",
      "noah.ns.cloudflare.com"
    ],
    "activated_at": null,
    "created_at": "2026-05-31T12:05:00Z",
    "updated_at": "2026-05-31T12:05:00Z"
  }
]
```

### Empty Response (200)
```json
[]
```

### Frontend Handling
- Show one row/card per domain.
- For pending domains, show the required `nameservers` and a **Check Status** action.
- For active domains, show the connected/active status and `activated_at`.

### Example Errors
**401 Unauthorized**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**403 Forbidden**
```json
{
  "detail": "You do not have permission to perform this action."
}
```
