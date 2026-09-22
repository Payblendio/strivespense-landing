# Strivespence Landing

Marketing site for Strivespence — personal expense tracking, insights, budgets, and AI guidance.

## Design

Abyssal terminal aesthetic (Auros-style) adapted to product brand tokens from `user-app` and `admin`:

| Token | Value | Source |
|-------|-------|--------|
| Brand teal | `#0F766E` | `AppTheme.primary` / admin `brand.teal` |
| Teal light | `#14B8A6` | `AppTheme.primaryLight` |
| Teal dark | `#155E75` | admin `brand.tealDark` |
| Logo | `logo_white.png` / `icon.png` | admin + user-app assets |

## Run

```bash
cd landing
npm install
npm run dev
```

Opens at http://localhost:5174

## Privacy Policy

Public policy page for App Store / Play Store listings:

- Local: http://localhost:5174/privacy.html
- Contact: support@strivespence.com.ng

Use the deployed HTTPS URL of this page in Apple App Privacy and Google Play Data safety forms.
