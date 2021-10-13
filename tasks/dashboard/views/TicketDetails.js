const blessed = require("blessed");
const {cyan} = require("chalk");

function TicketDetails(ticket, user) {
  const box = blessed.box({
    // parent: parent,
    keys: true,
    fg: "white",
    selectedFg: "white",
    selectedBg: "blue",
    interactive: false,
    // label: "Draw and Prize Distribution",
    width: "shrink",
    height: "shrink",
    // border: { type: "line", fg: "cyan" },
    content: 
`${cyan('Name')}: ${ticket.name}
${cyan('Symbol')}: ${ticket.symbol}
${cyan('Total Supply')}: ${ticket.totalSupply}
${cyan(`Wallet Balance`)}: ${ticket.balanceOf}`,
  });

  return box;
}

module.exports = {
  TicketDetails,
};
