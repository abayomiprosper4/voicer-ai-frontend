# Backend API Reference

This project strictly adheres to the backend schema provided at `https://voicer-api-jwer.onrender.com/docs/`.

## Type Safety
We have generated TypeScript types directly from the OpenAPI schema. 
These types are located at `lib/api/types.ts`.

**Whenever interacting with the backend or creating state for API data, you MUST import and use the types from `lib/api/types.ts` to ensure strict adherence to the backend's response shapes.**

## API Patterns
Based on the OpenAPI spec:
- Standard RESTful routes (`/projects`, `/tasks`, `/submissions`, `/reviews`)
- Submissions include signed AWS/cloud storage URLs for audio playback valid for 1 hour.
- Exports are asynchronous (returns `exportId`, then client must poll).

## Tanstack Query
Currently, `@tanstack/react-query` is **NOT** installed in `package.json`. If we are using it to handle data fetching (which is highly recommended for caching and polling), we need to run `npm i @tanstack/react-query`.
