const getLegalActions = message => {
  const status = JSON.parse(message);
  let legalMoves = [];
  let legalSwitches = [];
  let forceSwitch = false;

  if (status.forceSwitch) {
    forceSwitch = true;
    status.side.pokemon.forEach((pokemon, index) => {
      if (pokemon.condition !== "0 fnt" && pokemon.active !== true) {
        legalSwitches.push(index + 1);
      }
    });
  } else {
    status.active[0].moves.forEach(move => {
      if (!move.disabled && move.pp > 0) {
        legalMoves.push(move.id);
      }
    });

    status.side.pokemon.forEach((pokemon, index) => {
      if (pokemon.condition !== "0 fnt" && pokemon.active !== true) {
        legalSwitches.push(index + 1);
      }
    });
  }
  console.log("Here are our legal choices:", {
    moves: legalMoves,
    switches: legalSwitches,
    forceSwitch
  });
  return { moves: legalMoves, switches: legalSwitches, forceSwitch };
};

const pickRandomly = array => Math.floor(Math.random() * array.length);

const pickAction = (message, roomId) => {
  const legalActions = getLegalActions(message);
  if (
    (Math.random() < 0.8 && !legalActions.forceSwitch) ||
    legalActions.switches === []
  ) {
    return `${roomId}|/move ${pickRandomly(legalActions.moves) + 1}`;
  } else {
    return `${roomId}|/switch ${
      legalActions.switches[pickRandomly(legalActions.switches)]
    }`;
  }
};

// const switchToNewPokemon = status => {
//   console.log("We're running the forced switch algorithm! Huzzah.");
//   console.log(status);
//   const legalSwitches = status.side.pokemon.forEach(pokemon, index=> {
//     if (pokemon.condition !== '0 fnt' || pokemon.active !== true) {
//       return index+1
//     }
//   })
//   return legalSwitches
// };

module.exports = pickAction;
