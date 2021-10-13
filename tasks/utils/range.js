function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

module.exports = {
  range,
}