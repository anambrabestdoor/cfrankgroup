CFRANK Enterprise — INFRASTRUCTURE, STORAGE LIMITS & SUPABASE RELIABILITY

You are responsible for hardening the Cfrank Enterprise application's infrastructure configuration.

The application uses:

Next.js
Vercel
Supabase
Cloudinary
Resend

The goal is to keep the application lightweight and reliable while preventing unrestricted media uploads, unnecessary database growth, accidental API abuse, and avoidable inactivity-related Supabase pauses.

Do not bypass service-provider restrictions.

Do not create fake usage or fake customer activity.

1. AUDIT FIRST

Before implementing anything, inspect the existing project.

Identify:

Cloudinary upload implementation
Cloudinary upload presets
media types supported
Supabase database schema
Supabase queries
Supabase Storage usage
Supabase Edge Functions
Next.js API routes
Server Actions
Vercel Cron configuration if present
Resend integration
environment variables
admin authentication
upload UI
upload validation
file deletion behaviour
orphaned media handling

Do not duplicate existing infrastructure unnecessarily.

2. CENTRALIZE ALL UPLOAD LIMITS

Do NOT scatter file-size limits throughout components.

Create a single server-side configuration/constants module for media limits.

Example conceptual structure:

MEDIA_LIMITS

images:

max file size: 5 MB
allowed MIME types: image/jpeg, image/png, image/webp
optionally allow AVIF if the processing pipeline supports it
maximum dimensions: approximately 3000px on the longest side

videos:

max file size: 50 MB
allowed MIME types: video/mp4, video/webm
maximum duration: approximately 90 seconds
maximum dimensions/resolution appropriate for the website

These values must be configurable.

Do not use magic numbers throughout the application.

3. VALIDATE BEFORE CLOUDINARY UPLOAD

The browser should provide early feedback, but CLIENT-SIDE validation is NOT sufficient.

Validate again on the server.

Before an upload reaches Cloudinary:

Check MIME type.
Check actual file size.
Check extension where appropriate.
Reject unsupported file types.
Enforce image dimensions where applicable.
Enforce video duration where practical.
Reject obviously dangerous or malformed uploads.
Only then initiate the Cloudinary upload.

Never trust:

filename
extension
client-provided MIME type
client-provided file size

as the sole security mechanism.

4. CLOUDINARY ARCHITECTURE

Use Cloudinary for media rather than storing large image/video binaries inside PostgreSQL.

Recommended conceptual organization:

cfrank-Enterprise/
products/
projects/
gallery/
blog/
branding/

Store only appropriate references/metadata in Supabase, such as:

Cloudinary public ID
secure URL
resource type
format
width
height
duration for videos
file size
alt text
associated product/project/blog ID

Do not store binary media in PostgreSQL.

5. CLOUDINARY TRANSFORMATIONS

Use Cloudinary transformations intelligently.

For images:

resize appropriately
automatic quality
modern format delivery where supported
responsive dimensions
avoid serving original 5 MB images to mobile visitors

For videos:

optimize delivery
use appropriate codecs/formats
avoid unnecessarily serving huge original files

Do not create unlimited transformation variants.

Avoid transformation patterns that could be abused to generate enormous numbers of derived assets.

6. MEDIA ITEM LIMITS

In addition to file-size limits, implement sensible per-resource limits.

For example:

Products:

configurable maximum number of images
configurable maximum number of videos

Projects:

configurable maximum gallery items
configurable video count

Blog:

reasonable featured-image/media limits

Do not hardcode arbitrary limits into individual UI components.

Make them configurable from one location.

7. DELETE MEDIA PROPERLY

When an administrator deletes a media item:

remove its database reference
delete the corresponding Cloudinary asset when appropriate
avoid leaving orphaned assets

Be careful when the same Cloudinary asset is referenced in multiple places.

Never delete an asset merely because one database record was removed unless ownership/reference rules confirm it is safe.

8. SUPABASE DATABASE PROTECTION

The PostgreSQL database should contain structured business data, not large media files.

Use appropriate:

indexes
foreign keys
constraints
RLS
validation
pagination
query limits

Avoid:

SELECT * on large tables where unnecessary
loading thousands of records into one page
unbounded API queries
duplicated data
storing large JSON blobs unnecessarily

Admin lists should use pagination.

Public product/catalogue queries should retrieve only required fields.

9. SUPABASE FREE-TIER INACTIVITY

The Supabase Free plan may pause inactive projects.

Do NOT attempt to generate fake visitors, fake users, fake orders, fake analytics, or other artificial activity.

Instead, implement a minimal legitimate infrastructure health check.

Create a lightweight scheduled health-check mechanism that periodically performs a harmless, read-only operation against the production Supabase project.

The operation should:

authenticate appropriately
execute a minimal database health query
return success/failure
consume as little database/network usage as possible
not modify business data
not create fake records
not update timestamps simply to simulate customer activity

Prefer a minimal query such as a health check rather than reading actual application tables unnecessarily.

10. SCHEDULED HEALTH CHECK

If Vercel Cron is available for the deployed application, create a protected cron endpoint such as:

/api/cron/health

Configure an appropriate recurring schedule.

The endpoint should:

Verify the request is genuinely from the configured scheduler.
Perform a minimal Supabase health query.
Return a simple JSON status.
Avoid exposing database information.
Log only useful operational information.
Fail safely.

Do not expose the health endpoint as an unrestricted database endpoint.

Do not allow arbitrary users to trigger expensive queries.

11. CRON AUTHENTICATION

Protect the cron endpoint using the deployment platform's supported cron authentication mechanism or a strong server-side secret.

Never place the secret in client-side JavaScript.

Never expose it through:

public API responses
HTML
browser bundles
client components

Use environment variables.

12. KEEP-ALIVE SAFETY

The health-check mechanism must be extremely lightweight.

Do NOT:

insert rows every few minutes
update fake "last active" records
create fake users
create fake orders
create fake page views
generate unnecessary analytics events
perform full-table scans
download media
call Cloudinary unnecessarily
send emails

The purpose is infrastructure health monitoring, not artificial application activity.

If Supabase changes its inactivity policy or provides an official mechanism that makes this unnecessary, prefer the official mechanism.

13. HEALTH MONITORING

The health endpoint should make failures visible.

Return something conceptually similar to:

{
"status": "ok"
}

Do not expose:

database credentials
Supabase project identifiers unnecessarily
internal errors
stack traces
environment variables

Server logs can contain more detailed diagnostic information where appropriate.

14. RESEND PROTECTION

Audit all Resend email paths.

Implement:

server-side API key usage
validation
rate limiting for public forms
sensible email frequency
protection against automated spam

Do not allow an unauthenticated user to generate unlimited emails.

For contact forms, consider:

rate limiting
honeypot fields
CAPTCHA/Turnstile where justified
validation

Do not send an email for every client-side interaction.

15. VERCEL PROTECTION

Ensure the application is compatible with Vercel deployment.

Audit:

server functions
API routes
Server Actions
cron endpoint
environment variables
caching
function duration
external requests

Do not assume local development behaviour is identical to Vercel production.

The production build must succeed.

16. ENVIRONMENT VARIABLES

Centralize and document required environment variables.

Potential variables include:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

RESEND_API_KEY

CRON_SECRET

Never expose server-only credentials through NEXT_PUBLIC_ variables.

Never commit .env files containing secrets.

Verify .gitignore.

17. RATE LIMITING

Identify public endpoints that could be abused.

Potential targets:

contact form
newsletter form
authentication
password reset
public API
media upload initiation
search
checkout/order submission

Implement appropriate rate limiting without unnecessarily harming legitimate users.

Use server-side enforcement.

18. DATABASE BACKUP / RECOVERY

Do not assume the Free tier is a complete backup strategy.

Design the application so that important business data can eventually be backed up/exported.

Where practical, create an administrative export mechanism for structured data such as:

products
categories
blog posts
FAQs
projects
configuration

Do not expose backups publicly.

Do not store backup credentials in client-side code.

If an automated external backup system is implemented, document it separately.

19. MEDIA FAILURE HANDLING

If Cloudinary is temporarily unavailable:

do not crash the entire application
show useful error messages
avoid writing broken media URLs to the database
clean up partial records where appropriate

If Supabase is temporarily unavailable:

show graceful errors
do not expose internal database errors
do not create duplicate records because of retries

Design important mutations to be safe against accidental duplicate submissions.

20. UPLOAD UX

The admin upload interface should clearly display:

accepted file types
maximum file size
video duration limit
upload progress where available
validation errors
successful upload status
failed upload status

Example:

"Images up to 5 MB"

"Videos up to 50 MB and 90 seconds"

Do not hide restrictions until after the user selects a file.

21. STORAGE MONITORING

Where APIs allow it, create an admin-facing infrastructure summary showing useful information such as:

number of products
number of media items
number of uploaded images
number of uploaded videos
approximate stored media size
recent upload failures

Do not claim exact Cloudinary billing usage unless the relevant official API provides that data.

Do not fabricate usage statistics.

22. SECURITY AUDIT

After implementation, verify:

no secrets in client bundles
no service-role key exposed
upload validation works server-side
admin-only uploads
RLS remains enabled
cron endpoint protected
public APIs rate-limited where necessary
Cloudinary credentials protected
Resend credentials protected
malformed uploads rejected
oversized files rejected
invalid MIME types rejected
23. TEST THE LIMITS

Actually test the upload restrictions.

Test:

Images
valid 1 MB image → accepted
valid 4.9 MB image → accepted




5 MB image → rejected

unsupported image type → rejected
malformed file → rejected
Videos
valid 20 MB video → accepted
valid 49 MB video → accepted




50 MB video → rejected

video exceeding configured duration → rejected
unsupported format → rejected
malformed file → rejected

Adjust limits if the actual Cloudinary pipeline requires different values.

24. FINAL AUDIT

Before finishing, verify:

Cloudinary
centralized limits
server-side validation
image optimization
video optimization
media organization
orphan prevention
Supabase
database remains structured
no media binaries stored unnecessarily
RLS remains enabled
queries are bounded
health check works
cron is protected
Resend
API key server-side
forms protected
spam controls
Vercel
production build succeeds
cron works
environment variables documented
Security
no secrets exposed
upload abuse mitigated
public endpoints protected

Return a final infrastructure report showing:

upload limits implemented
database protections
Cloudinary configuration
Resend protections
Supabase health-check implementation
Vercel cron configuration
environment variables required
tests performed
remaining risks