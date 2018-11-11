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
  console.log(expectedDamage);
  // return ONLY the move with the largest expected damage.
  return expectedDamage.reduce((x, y) => {
    if (Math.max(x.damage, y.damage) === x.damage) return x;
    else return y;
  });
};

console.log(
  strongestMove(
    `{
  "active": [
    {
      "moves": [
        {
          "move": "Body Slam",
          "id": "bodyslam",
          "pp": 24,
          "maxpp": 24,
          "target": "normal",
          "disabled": false
        },
        {
          "move": "Slash",
          "id": "slash",
          "pp": 32,
          "maxpp": 32,
          "target": "normal",
          "disabled": false
        },
        {
          "move": "Surf",
          "id": "surf",
          "pp": 24,
          "maxpp": 24,
          "target": "allAdjacentFoes",
          "disabled": false
        },
        {
          "move": "Blizzard",
          "id": "blizzard",
          "pp": 8,
          "maxpp": 8,
          "target": "normal",
          "disabled": false
        }
      ]
    }
  ],
  "side": {
    "name": "Guest 9103408",
    "id": "p1",
    "pokemon": [
      {
        "ident": "p1: Kabuto",
        "details": "Kabuto, L88",
        "condition": "232/232",
        "active": true,
        "stats": { "atk": 227, "def": 245, "spa": 166, "spd": 166, "spe": 183 },
        "moves": ["bodyslam", "slash", "surf", "blizzard"],
        "baseAbility": "none",
        "item": "",
        "pokeball": "pokeball"
      },
      {
        "ident": "p1: Vileplume",
        "details": "Vileplume, L74",
        "condition": "263/263",
        "active": false,
        "stats": { "atk": 192, "def": 199, "spa": 221, "spd": 221, "spe": 147 },
        "moves": ["megadrain", "bodyslam", "stunspore", "swordsdance"],
        "baseAbility": "none",
        "item": "",
        "pokeball": "pokeball"
      },
      {
        "ident": "p1: Ditto",
        "details": "Ditto, L88",
        "condition": "264/264",
        "active": false,
        "stats": { "atk": 171, "def": 171, "spa": 171, "spd": 171, "spe": 171 },
        "moves": ["transform"],
        "baseAbility": "none",
        "item": "",
        "pokeball": "pokeball"
      },
      {
        "ident": "p1: Nidoqueen",
        "details": "Nidoqueen, L74",
        "condition": "286/286",
        "active": false,
        "stats": { "atk": 195, "def": 202, "spa": 184, "spd": 184, "spe": 186 },
        "moves": ["earthquake", "thunderbolt", "bodyslam", "blizzard"],
        "baseAbility": "none",
        "item": "",
        "pokeball": "pokeball"
      },
      {
        "ident": "p1: Slowbro",
        "details": "Slowbro, L68",
        "condition": "270/270",
        "active": false,
        "stats": { "atk": 170, "def": 217, "spa": 177, "spd": 177, "spe": 109 },
        "moves": ["rest", "amnesia", "thunderwave", "surf"],
        "baseAbility": "none",
        "item": "",
        "pokeball": "pokeball"
      },
      {
        "ident": "p1: Alakazam",
        "details": "Alakazam, L68",
        "condition": "216/216",
        "active": false,
        "stats": { "atk": 136, "def": 129, "spa": 251, "spd": 251, "spe": 231 },
        "moves": ["seismictoss", "psychic", "thunderwave", "recover"],
        "baseAbility": "none",
        "item": "",
        "pokeball": "pokeball"
      }
    ]
  },
  "rqid": 2
}
`,
    "bulbasaur"
  )
);
