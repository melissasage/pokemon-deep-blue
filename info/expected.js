const pokedex = require("./gen1/pokedex");
const BattleMovedex = require("./gen1/moves");
const baseMovedex = require("./gen1/baseMovedex");
const BattleTypeChart = require("./gen1/typechart");
const baseTypeChart = require("./gen1/baseTypeChart");
const effKey = [1, 2, 0.5, 0];

const findBasePower = move => {
  let bp;
  if (BattleMovedex[move.id] !== undefined) {
    if (BattleMovedex[move.id].basePower !== undefined) {
      bp = BattleMovedex[move.id].basePower;
    } else {
      bp = baseMovedex.BattleMovedex[move.id].basePower;
    }
  } else {
    bp = baseMovedex.BattleMovedex[move.id].basePower;
  }
  return bp;
};

const findMoveType = move => {
  let moveType;
  if (BattleMovedex[move.id] !== undefined) {
    if (BattleMovedex[move.id].type !== undefined) {
      moveType = BattleMovedex[move.id].moveType;
    } else {
      moveType = baseMovedex.BattleMovedex[move.id].type;
    }
  } else {
    moveType = baseMovedex.BattleMovedex[move.id].type;
  }
  return moveType;
};

const calculateTypeEffectiveness = (moveType, foe) => {
  const foeType1 = pokedex.BattlePokedex[foe].types[0];
  const foeType2 =
    pokedex.BattlePokedex[foe].types[1] === undefined
      ? undefined
      : pokedex.BattlePokedex[foe].types[1];

  let typeEff1, typeEff2;
  if (BattleTypeChart[moveType] !== undefined) {
    typeEff1 = BattleTypeChart[foeType1].damageTaken[moveType];
    typeEff2 =
      foeType2 === undefined
        ? undefined
        : BattleTypeChart[foeType2].damageTaken[moveType];
  } else {
    typeEff1 = baseTypeChart.BattleTypeChart[foeType1].damageTaken[moveType];
    typeEff2 =
      foeType2 === undefined
        ? undefined
        : baseTypeChart.BattleTypeChart[foeType2].damageTaken[moveType];
  }
  const combinedTypeEff =
    typeEff2 === undefined
      ? effKey[typeEff1]
      : effKey[typeEff1] * effKey[typeEff2];
  return combinedTypeEff;
};

const calculateSTAB = (moveType, pokemon) => {
  /p[\d]: ([\w\d]+)/.test(pokemon[0].ident);
  return pokedex.BattlePokedex[RegExp.$1.toLowerCase()].types.some(
    x => x === moveType
  )
    ? 1.5
    : 1;
};

const strongestMove = (message, foe) => {
  const status = JSON.parse(message);
  const expectedDamage = status.active[0].moves
    .map(move => {
      // don't bother with the rest of this if there is no PP!
      if (!move.pp) return undefined;

      const activePokemon = status.side.pokemon.filter(
        pokemon => pokemon.active === true
      );
      const moveType = findMoveType(move);

      const bp = findBasePower(move);
      const typeEff = calculateTypeEffectiveness(moveType, foe);
      const STAB = calculateSTAB(moveType, activePokemon);

      return { id: move.id, damage: bp * typeEff * STAB };
    })
    .filter(x => x !== undefined); // clean off moves with empty PP

  // return ONLY the move with the largest expected damage.
  return expectedDamage.reduce((x, y) => {
    if (Math.max(x.damage, y.damage) === x.damage) return x;
    else return y;
  });
};

module.exports = strongestMove;
