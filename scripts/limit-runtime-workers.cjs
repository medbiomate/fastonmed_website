// Set native pool limits before Next.js loads its image and Rust libraries.
// This travels with the standalone output, so hosting rebuilds retain the limits.
const fs = require('node:fs');
const path = require('node:path');
const server = path.join(process.cwd(), '.next', 'standalone', 'server.js');
const marker = '// FastonMed native worker limits';
const content = fs.readFileSync(server, 'utf8');
if (!content.includes(marker)) {
  const prefix = `${marker}\nprocess.env.RAYON_NUM_THREADS ||= '1';\nprocess.env.TOKIO_WORKER_THREADS ||= '2';\nprocess.env.UV_THREADPOOL_SIZE ||= '2';\nprocess.env.VIPS_CONCURRENCY ||= '1';\n`;
  fs.writeFileSync(server, prefix + content);
}
console.log('Standalone native worker limits applied');
