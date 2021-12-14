function mapIdToObject(ids, objects) {
  return ids.map((id, idx) => ({
      drawId: id,
      prizeDistribution: objects[idx]
  }))
}

module.exports = {
  mapIdToObject
}