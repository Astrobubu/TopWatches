# Agent Notes

## Deferred TODO: Move Media To Cloudflare

Goal: reduce Vercel cached egress by serving heavy media outside Vercel.

Recommended setup:
- Keep the Next.js app on Vercel.
- Create a Cloudflare R2 bucket for watch photos, hero images, and blog images.
- Serve public assets from a custom hostname such as `assets.goldenplanetwatches.com`.
- Keep generated variants in R2: original, optimized, and thumbnail.
- Store the resulting public R2 URLs in Supabase `watch_images`.

Avoid:
- Do not put the entire Vercel app behind a Cloudflare reverse proxy unless there is a strong reason. Vercel advises against this because it can reduce firewall/bot visibility, introduce cache reliability issues, and add latency.

Implementation outline:
1. Create R2 bucket and public/custom domain.
2. Add environment variables for R2 account ID, bucket, access key, secret, and public asset base URL.
3. Update `src/lib/image-processing.ts` and upload/import routes to write processed images to R2 instead of Supabase Storage.
4. Add a migration route or script to copy existing Supabase-hosted images into R2 and update `watch_images`.
5. Verify image URLs, cache headers, and Vercel cached egress after deploy.
