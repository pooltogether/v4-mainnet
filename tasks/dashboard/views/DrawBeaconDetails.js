const blessed = require("blessed");
const { DateTime, Duration } = require('luxon');
const {cyan, green} = require("chalk");
const {shortenAddress} = require("../../utils/shortenAddress");

function DrawBeaconDetails(drawBeacon, data, config) {
  const date = DateTime.fromMillis(drawBeacon.beaconPeriodStartedAt * 1000);
  const dateDiff = DateTime.fromMillis((drawBeacon.beaconPeriodStartedAt.add(1800) * 1000));
  const dateFuture = DateTime.fromMillis((drawBeacon.beaconPeriodStartedAt.add(1800) * 1000));
  const calendar = date.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
  const diff = dateDiff.toRelative({
    style: 'short'
  })
  const calendarFuture = dateFuture.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);

  const box = blessed.box({
    // parent: parent,
    fg: "white",
    selectedFg: "white",
    selectedBg: "blue",
    interactive: false,
    width: "shrink",
    height: "shrink",
    top: config.top,
    content: 
`${cyan('Next Draw ID:')} ${drawBeacon.nextDrawId}
${cyan('Period Seconds:')} ${drawBeacon.beaconPeriodSeconds}
${cyan('Period Seconds:')} ${drawBeacon.beaconPeriodStartedAt}
${cyan('Last RNG Block:')} ${drawBeacon.lastRngLockBlock}
${cyan('Last RNG ID:')} ${drawBeacon.lastRngRequestId}
${cyan('Draw History:\n')}${drawBeacon.drawBuffer}
${cyan('RNG Service:\n')}${drawBeacon.rngService}

------------------
A new draw can complete every ${cyan(drawBeacon.beaconPeriodSeconds / 60)} minutes. The last draw occured at ${cyan(calendar)}. 
Draw ${cyan(drawBeacon.nextDrawId)} can complete at ${cyan(calendarFuture)} which is in ${cyan(diff)}.

Upcoming PrizeDistribution parameters:
 - ${green('Bitrange')}: ${cyan('3')}
 - ${green('Cardinality')}: ${cyan('5')}
 - ${green('Picks')}: ${cyan('1,000')}

The manager (${cyan(shortenAddress(data.manager))}) will read from the ${cyan('DrawBuffer')} and push the ${cyan('Draw')} and ${cyan('PrizeDisribution')} via ${cyan('L1TimelockManager')}.

DrawBeacon pushes draws onto DrawBuffer (${cyan(shortenAddress(data.contracts.DrawBuffer))})

`
  });

  return box;
}

// ${cyan()}

module.exports = {
  DrawBeaconDetails,
};
