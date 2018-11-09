const getLegalActions = message => {
  const legalMoves = [];
  const legalSwitches = [];
  const status = JSON.parse(message);

  status.active[0].moves.forEach(move => {
    if (!move.disabled && move.pp > 0) {
      legalMoves.push(move.id);
    }
  });

  status.side.pokemon.forEach(pokemon => {
    if (!pokemon.active && pokemon.condition[0] !== "0") {
      legalSwitches.push(pokemon.ident.slice(4));
    }
  });

  return { moves: legalMoves, switches: legalSwitches };
};

const pickRandomly = array => Math.floor(Math.random() * array.length);

const pickAction = (message, roomId) => {
  const legalActions = getLegalActions(message);
  if (Math.random() < 0.8) {
    return `${roomId}|/move ${pickRandomly(legalActions.moves) + 1}`;
  } else {
    return `${roomId}|/switch ${pickRandomly(legalActions.switches) + 1}`;
  }
};

module.exports = pickAction;
