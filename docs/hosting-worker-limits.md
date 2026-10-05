# Shared-hosting worker limits

The 5 October resource screenshot shows 99 average processes with a 120 limit.
Runtime logs show repeated Next.js startup attempts and occasional shutdown errors.
The exact account-wide process owners are not exposed by the hosting connector;
this does not prove that all 99 processes belong to the website.

The live website's .htaccess now sets RAYON_NUM_THREADS=1,
TOKIO_WORKER_THREADS=2, UV_THREADPOOL_SIZE=2, VIPS_CONCURRENCY=1,
and adds --v8-pool-size=1 to NODE_OPTIONS while retaining Hostinger's preload.
After applying these settings the shop loaded in the browser without console
errors. Exact resource reduction still needs the hosting dashboard measurement.

Next config limits build CPUs to two and Sharp image concurrency to one.
The postbuild script prefixes the standalone server with native pool defaults
before Next.js loads, retaining these limits across fresh deployments. Explicit
hosting environment values take precedence. Hostinger can regenerate .htaccess,
so the V8 startup flag may need reapplication after a deployment.

Lower concurrency can queue image work under heavy traffic. These limits do not
remove app processes, change product persistence, or disable shared apps.
Do not replace masked hosting environment variables with their masked values.
Deploy only through the existing Git push trigger; do not additionally start a
second build. Verify shop rendering and images, not just JSON endpoint status.
