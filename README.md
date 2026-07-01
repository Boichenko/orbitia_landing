# Orbitia Landing

Landing page for the Orbitia Telegram bot. The page explains the solar-return
PDF flow and sends users to the bot in Telegram.

## Stack

- TanStack Start
- React
- Tailwind CSS
- shadcn/ui components
- Bun

## Project Structure

- `src/routes/index.tsx` — main landing page
- `src/routes/__root.tsx` — app shell, metadata, fonts and global CSS link
- `src/components/ui` — reusable shadcn/ui components
- `src/lib` — shared utilities and error helpers
- `src/hooks` — React hooks
- `src/assets` — asset manifests used by imports
- `public/assets` — static images served by Vite

## Commands

```bash
bun install
bun run dev
bun run build
bun run lint
```
