/** Reuse derived data only while the source snapshot has the same identity.
 * Weak keys allow replaced database snapshots and their derived arrays to be collected.
 */
export function createSnapshotMapper<T extends object, R>(map: (snapshot: T) => R): (snapshot: T) => R {
  const values = new WeakMap<T, R>();
  return snapshot => {
    if (values.has(snapshot)) return values.get(snapshot)!;
    const value = map(snapshot);
    values.set(snapshot, value);
    return value;
  };
}
