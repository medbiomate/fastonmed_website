# Product disappearance investigation — 5 October 2026

Breast cancer screening device Breastlight™ (prod-1791057259752), created
4 October, existed in MySQL but was absent from the live deployment's JSON
catalog. Portable Electronic Colposcope Sunlnadscope was present in both.
A full database recovery snapshot was saved locally under
`data/backups/product-recovery-2026-10-05/database-snapshot.json` before recovery.
Breastlight was restored through the existing admin endpoint and verified in
`/api/catalog?search=Breastlight`.

The admin and storefront previously preferred bundled JSON even when MySQL
contained newer records. Background recovery restored only media fields of
records already present in the file. Deployment files therefore could hide
new products or reintroduce old statuses. Hostinger reports the current
version deployed at 2026-10-04T05:48:49Z. This identifies the stale-file failure;
it does not establish that every missing item was deleted during deployment.
The save endpoint also ignored MySQL's false return and reported success.

All product list readers now use a shared MySQL snapshot, refreshed every
10 seconds and invalidated after mutations. Files are an outage fallback.
An empty database is distinct from a failed query. Saves require a confirmed
MySQL write before updating files or returning success. Deletion failures
return an error. JSON writes use atomic rename. Unconfigured, unawaited
secondary-backend mutation fan-out has been removed to keep one write source.

Validation: production build, TypeScript, and `node --test
tests/product-persistence.cjs`. Regression coverage checks durable reads with
stale files, failed saves without cache mutation, and cache invalidation races.

Operational requirements: preserve the MySQL database across deployments;
use hosting database backups with retention independent of application builds.
The JSON snapshots inside a release are not a substitute for database backups.
A database outage can temporarily show the file fallback; writes fail visibly
and must be retried. No system can promise immunity to every future outage.
