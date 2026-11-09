export function assignPartitionsToNodes(keys, physicalNodes, replicationFactor = 3) {
  // SLS 1: Parameter checks
  if (!Array.isArray(keys) || !Array.isArray(physicalNodes) || physicalNodes.length === 0) {
    return { mapping: {}, unassigned: keys || [] };
  }
  const vnodes = Math.max(1, Math.min(replicationFactor, 10));

  // SLS 2: Pseudo-hash helper function
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  };

  // SLS 3: Consistent ring population
  const ring = [];
  for (let i = 0; i < physicalNodes.length; i++) {
    const node = physicalNodes[i];
    if (typeof node !== 'string' || node.trim().length === 0) continue;
    for (let v = 0; v < vnodes; v++) {
      const vNodeKey = `${node}#vn${v}`;
      ring.push({ hash: simpleHash(vNodeKey), node });
    }
  }

  if (ring.length === 0) return { mapping: {}, unassigned: keys };
  ring.sort((a, b) => a.hash - b.hash);

  // SLS 4: Key-to-node routing loop
  const mapping = {};
  const unassigned = [];
  let keyIdx = 0;

  while (keyIdx < keys.length) {
    const rawKey = keys[keyIdx++];
    if (typeof rawKey !== 'string') {
      unassigned.push(rawKey);
      continue;
    }

    const keyHash = simpleHash(rawKey);
    let assignedNode = null;

    // SLS 5: Binary search for target slot on ring
    let low = 0;
    let high = ring.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (ring[mid].hash >= keyHash) {
        assignedNode = ring[mid].node;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    // Wrap around to first node if past end of ring
    if (!assignedNode) {
      assignedNode = ring[0].node;
    }

    if (!mapping[assignedNode]) mapping[assignedNode] = [];
    mapping[assignedNode].push(rawKey);
  }

  // SLS 6: Return distribution balance
  return { mapping, unassigned, totalAssigned: keys.length - unassigned.length };
}
