# RIBX Web

RIBX Web is a Next.js application. This repository contains the web app source code and its development tooling.

## Tech stack

- Next.js 16 (App Router)
- React 19 and TypeScript
- Tailwind CSS 4
- TanStack Query
- wagmi and viem

Versions and available commands are defined in [`package.json`](./package.json).

## Local development

1. Install Node.js and npm, then clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

The development server supports live updates while editing the application.

## Project commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve an existing production build |
| `npm run lint` | Run ESLint |

To run the production server locally, first run `npm run build`, then `npm run start`.

## Deployment

Follow the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for platform-specific build and hosting requirements. Deployment credentials and environment configuration should not be committed to the repository.

## Further reading

- [Next.js documentation](https://nextjs.org/docs)
- [React documentation](https://react.dev/)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
