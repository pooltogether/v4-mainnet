function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

function mapIdToObject(ids, objects) {
  return ids.map((id, idx) => ({
      drawId: id,
      prizeDistribution: objects[idx]
  }))
}

module.exports = {
  range,
  mapIdToObject
}