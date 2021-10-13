function shortenAddress(address, num = 7, showEnd = true) {
  if (!address) return null;
  return num
    ? `${address.slice(0).slice(0, num)}...${showEnd ? address.slice(0).slice(-num) : ''
    }`
    : address;
}


module.exports = {
  shortenAddress
}