const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const scope = { exports: {}, WeakMap };
vm.runInNewContext(ts.transpileModule(fs.readFileSync(require.resolve('../lib/catalog-snapshot-cache.ts'),'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, scope);
test('unchanged catalog snapshot avoids remapping, refreshed data is processed', () => {
 let calls = 0;
 const derive = scope.exports.createSnapshotMapper(snapshot => { calls++; return snapshot.filter(p => p.status === 'published').map(p => p.name).sort(); });
 const first = [{name:'B',status:'published'},{name:'Draft',status:'draft'}];
 const output = derive(first);
 for(let i=0;i<100;i++) assert.equal(derive(first),output);
 assert.equal(calls,1);
 assert.deepEqual(output,['B']);
 assert.deepEqual(derive([{name:'Updated',status:'published'}]),['Updated']);
 assert.equal(calls,2);
});
