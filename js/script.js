const express = require("express");
const fs = require("fs");
const { graphqlHTTP } = require("express-graphql");
const DataLoader = require("dataloader");
const {
  assertResolversPresent,
  makeExecutableSchema,
} = require("@graphql-tools/schema");

const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const node_port = 3000;

let mongo_file_path = "./config/mongo.json";
const config = require(mongo_file_path);

const enum_handed = {
  left: "L",
  right: "R",
  ambi: "A",
};

const rev_enum = {
  L: "left",
  R: "right",
  A: "ambi",
};

(async function () {
  host = config.host || "localhost";
  port = config.port || 27017;
  opts = config.opts || { useUnifiedTopology: true };
  const connection = new MongoClient("mongodb://" + host + ":" + port, opts);

  database = config.db || "ee547_hw";

  await connection.connect();
  db = connection.db(database);

  const typeDefs = fs.readFileSync("schema-v2.graphql").toString("utf-8");

  function checkValidJSON(file_path) {
    try {
      JSON.parse(fs.readFileSync(file_path, "utf8"));
    } catch (e) {
      return false;
    }
    return true;
  }

  const schema = makeExecutableSchema({
    resolvers,
    resolverValidationOptions: {
      requireResolversForAllFields: "ignore",
      requireResolversToMatchSchema: "ignore",
    },
    typeDefs,
  });

  // app.get("/ping", (req, res) => {
  //   res.sendStatus(204); 
  // });

  app.use(
    "/graphql",
    graphqlHTTP(async (req) => {
      return {
        schema,
        graphiql: true,
        context: {
          db: db,
          loaders: {
            player: new DataLoader((keys) => getPlayers(db, keys)),
            match: new DataLoader((keys) => getMatches(db, keys)),
          },
        },
      };
    })
  );

  //CHECK VALID JSON AND START SERVER
  valid_json = checkValidJSON(mongo_file_path);
  if (!valid_json) {
    process.exit(2);
  } else {
    app.listen(node_port);
    console.log("GraphQL API server running at http://localhost:3000/graphql");
  }
})();

//GET PLAYERS
async function getPlayers(db, keys) {
  keys = keys.map((key) => ObjectId(key));
  let players = await db
    .collection("player")
    .find({ _id: { $in: keys } })
    .toArray();
  return (
    players.map(formatPlayer) ||
    new Error((message = `players collection does not exist `))
  );
}

//GET MATCHES
async function getMatches(db, keys) {
  keys = keys.map((key) => ObjectId(key));
  let matches = await db
    .collection("match")
    .find({ _id: { $in: keys } })
    .toArray();
  return (
    formatMatch(matches) ||
    new Error((message = `matches collection does not exist `))
  );
}


("use strict");

const resolvers = {
  Match: {
    mid: ({ mid }, _, context) => {
      return mid;
    },
    title: ({ title }, _, context) => {
      return title;
    },
  },
  Mutation: {
    //MATCH AWARD
    matchAward: async (_,{mid,pid,points},context) =>{
      let match = await context.loaders.match.load(mid);
      let player = await context.loaders.player.load(pid);
      
      if (match == null || player == null) {
        return new Error((message = `match or player does not exist`));
      }
      if (match.p1_id == pid || match.p2_id == pid) {
        let inc_dict = {};
        if (match.p1_id == pid) {
          inc_dict.p1_points =  points?points:0;
        }
        if (match.p2_id == pid) {
          inc_dict.p2_points =  points?points:0;
        }
        let res = await context.db.collection("match").updateOne({ _id: ObjectId(mid) }, { $inc: inc_dict });
        if (res.matchedCount == 1) {
          await context.db.collection("player").updateOne({_id:ObjectId(pid)},{$inc:{total_points:points?points:0}})
          context.loaders.match.clear(mid);
          context.loaders.match.load(mid);
          return context.loaders.match.load(mid);
        }
      }
    else{
      return new Error((message = `player is not in match`));
    }
  },
//MATCH CREATE
  matchCreate: async(_,{pid1,pid2,entry_fee_usd_cents,prize_usd_cents},context) => {
    let player1 = await context.loaders.player.load(pid1);
    let player2 = await context.loaders.player.load(pid2);
    if (player1 == null || player2 == null) {
      return new Error((message = `player does not exist`));
    }
    if (player1.is_active == false || player2.is_active == false) {
      return new Error((message = `player is not active`));
    }
    if (player1.in_active_match || player2.in_active_match) {
      return new Error((message = `player is already in an active match`));
    }
    if(player1.balance_usd_cents<entry_fee_usd_cents || player2.balance_usd_cents<entry_fee_usd_cents){
      return new Error((message = `player does not have enough balance`));
    }
    let match = {
      created_at : new Date(),
      ended_at: null,
      entry_fee_usd_cents: entry_fee_usd_cents,
      is_dq: false,
      p1_id: pid1,
      p1_points: 0,
      p2_id: pid2,
      p2_points: 0,
      prize_usd_cents: prize_usd_cents,
    };
    let res = await context.db.collection("match").insertOne(match);
    let insertedid = res.insertedId;
    let update_dict = {
      $inc:{balance_usd_cents:-entry_fee_usd_cents,num_join:1},
      $set:{in_active_match:insertedid}
    }
    await context.db.collection("player").updateOne({_id:ObjectId(pid1)}, update_dict)
    await context.db.collection("player").updateOne({_id:ObjectId(pid2)}, update_dict)
    return context.loaders.match.load(insertedid);  
  },
//MATCH DISQUALIFY
  matchDisqualify: async(_,{mid},context) => {
    let match = await context.loaders.match.load(mid);
    if (match == null) {
      return new Error((message = `match does not exist`));
    }
    if (match.is_dq) {
      return new Error((message = `match is already disqualified`));
    }
    let update_dict = {is_dq:true,ended_at:new Date()}
    let res = await context.db.collection("match").updateOne({ _id: ObjectId(mid) }, { $set: update_dict });
    let res1 = await context.db.collection("player").updateOne({_id:ObjectId(match.p1_id)},{$inc:{num_dq:1}})
    let res2 = await context.db.collection("player").updateOne({_id:ObjectId(match.p2_id)},{$inc:{num_dq:1}})
    if (res.matchedCount == 1) {
      context.loaders.match.clear(mid);
      context.loaders.match.load(mid);
      return context.loaders.match.load(mid);
    }
  },
//MATCH END
  matchEnd: async(_,{mid},context) => {
    let match = await context.loaders.match.load(mid);
    if (match == null) {
      return new Error((message = `match does not exist`));
    }
    if (match.ended_at != null) {
      return new Error((message = `match is already ended`));
    }
    let update_dict = {ended_at:new Date()}
    if (match.p1_points > match.p2_points) {
      winner_pid = match.p1_id;
    }
    else if (match.p1_points < match.p2_points) {
      winner_pid = match.p2_id;
    } 
    else {
      winner_pid = null;
    }
    
    let res = await context.db.collection("match").updateOne({ _id: ObjectId(mid) }, { $set: update_dict });
    if (winner_pid != null) {
        await context.db.collection("player").updateOne({_id:ObjectId(winner_pid)},{$inc:{balance_usd_cents:match.prize_usd_cents,num_won:1}})
      }    
    
      if (res.matchedCount == 1) {
      context.loaders.match.clear(mid);
      await context.loaders.match.load(mid);
      return await context.loaders.match.load(mid);
    }
  },
//PLAYER CREATE
    playerCreate: async (_, { playerInput }, context) => {
      let player = {
        fname: playerInput.fname,
        lname: playerInput.lname,
        handed: enum_handed[playerInput.handed],
        balance_usd_cents: playerInput.initial_balance_usd_cents,
        is_active: false,
        num_join: 0,
        num_won: 0,
        num_dq: 0,
        total_points: 0,
        total_prize_usd_cents: 0,
        efficiency: 0,
        in_active_match: false,
      };
      let res = await context.db.collection("player").insertOne(player);
      return context.loaders.player.load(res.insertedId);
    },
//PLAYER UPDATE
    playerUpdate: async (_, { pid, playerInput }, context) => {
      let updated_dict = {}
      if(playerInput.lname!=null){
        updated_dict["lname"] = playerInput.lname
    }
    if(playerInput.is_active!=null){
        updated_dict["is_active"] = playerInput.is_active;
    }
      let res = await context.db.collection("player").updateOne(
        { _id: ObjectId(pid) },
        {
          $set:   updated_dict
        }
      )
      context.loaders.player.clear(pid);
      context.loaders.player.load(pid)
      return context.loaders.player.load(pid);
    },
//PLAYER DELETE
    playerDelete: async (_, { pid }, context) => {
      let player = await context.loaders.player.load(ObjectId(pid));
      if (player == null) {
        return new Error((message = `player does not exist`));
      }
      if (player.is_active) {
        return new Error((message = `player is an active player`));
      }

      let res = await context.db.collection("player").deleteOne({ _id: ObjectId(pid) });
      if (res.deletedCount>0) {
        return true;
      }
      return false;
    },
//PLAYER DEPOSIT
    playerDeposit: async (_, { pid,amount_usd_cents }, context) => {
      let player = await context.loaders.player.load(ObjectId(pid));
      if (player == null) {
        return new Error((message = `player does not exist`));
        }
      let res = await context.db.collection("player").updateOne({_id:ObjectId(pid)},{$inc:{balance_usd_cents:amount_usd_cents}})
      if (res.matchedCount == 1) {
        context.loaders.player.clear(pid);
        context.loaders.player.load(pid);
        return context.loaders.player.load(pid);
      }
    },
    matches: async (_, { limit = 20, offset = 0, sort = null }, context) => {
      let matches = await await context.db.collection("match").find().toArray();
      if (matches == null) return null;
      if (sort != null) {
        matches.sort((a, b) => {
          if (a[sort] < b[sort]) {
            return -1;
          }
          if (a[sort] > b[sort]) {
            return 1;
          }
          return 0;
        });
      }
      return matches.slice(offset, offset + limit).map(formatMatch);
    },
  },
  Query: {
    player: (_, { pid }, context) => {
      return context.loaders.player.load(pid);
    },
    players: async (_, { limit = 20, offset = 0, sort = null }, context) => {
      let players = await context.db.collection("player").find().toArray();
      if (players == null) return null;
      if (sort != null) {
        players.sort((a, b) => {
          if (a[sort] < b[sort]) {
            return -1;
          }
          if (a[sort] > b[sort]) {
            return 1;
          }
          return 0;
        });
      }
      return players.slice(offset, offset + limit).map(formatPlayer);
    },
    match: (_, { mid }, context) => {
      return context.loaders.match.load(mid);
    },
    matches: async (_, { limit = 20, offset = 0, sort = null }, context) => {
      let result = [];
      let active_matches = [];
      let ended_matches = [];
      active_matches = await context.db
        .collection("match")
        .find({ ended_at: null })
        .toArray();
      if (active_matches.length > 0) {
        active_matches = await formatMatch(active_matches);
        Promise.all(active_matches).then((values) => {
          values.sort((a, b) => {
            if (a.prize_usd_cents < b.prize_usd_cents) {
              return 1;
            }
            if (a.prize_usd_cents > b.prize_usd_cents) {
              return -1;
            }
            return 0;
          });
          active_matches = values;
        });
      }
      ended_matches = await context.db
        .collection("match")
        .find({ ended_at: { $ne: null } })
        .toArray();
      if (ended_matches.length > 0) {
        ended_matches = await formatMatch(ended_matches);
        Promise.all(ended_matches).then((values) => {
          values.sort((a, b) => {
            if (a.ended_at < b.ended_at) {
              return 1;
            }
            if (a.ended_at > b.ended_at) {
              return -1;
            }
            return 0;
          });
          ended_matches = values;
        });
      }
      result = [...active_matches, ...ended_matches.slice(0, 4)];
      return result.slice(offset, offset + limit);
    },
    Player: {
      userId: ({ user_id }, _, context) => {
        return user_id;
      },
    },
  },
};


//FORMAT PLAYER
function formatPlayer(player) {
  if (player == null) return null;

  if (Array.isArray(player)) {
    return player.map(formatPlayer);
  }

  let res = {
    pid: player._id,
    fname: player.fname,
    lname: player.lname,
    name: `${player.fname}${player.lname ? ` ${player.lname}` : ""}`,
    handed: rev_enum[player.handed],
    is_active: player.is_active,
    num_join: player.num_join ? player.num_join : 0,
    num_won: player.num_won ? player.num_won : 0,
    num_dq: player.num_dq ? player.num_dq : 0,
    balance_usd_cents: player.balance_usd_cents,
    total_points: player.total_points ? player.total_points : 0,
    total_prize_usd_cents: player.total_prize_usd_cents
      ? player.total_prize_usd_cents
      : 0,
    efficiency: player.num_won/(player.num_join) ? player.num_won/(player.num_join) : 0,
    in_active_match: player.in_active_match ? true : false,
  };
  return res;
}

//FORMAT MATCH
function formatMatch(match) {
  if (match == null) return null;
  if (Array.isArray(match)) {
    return Promise.all(match.map(formatMatch));
  } else {
    let res = Promise.all([
      db
        .collection("player")
        .find({ _id: ObjectId(match.p1_id) })
        .toArray(),
      db
        .collection("player")
        .find({ _id: ObjectId(match.p2_id) })
        .toArray(),
    ]).then((players) => {
      players = formatPlayer(players);
      res = {
        mid: match._id,
        entry_fee_usd_cents: match.entry_fee_usd_cents,
        p1_id: match.p1_id,
        p1: players[0][0],
        p1_points: match?.p1_points ? match.p1_points : 0,
        p2_id: match.p2_id,
        p2: players[1][0],
        p2_points: match?.p2_points ? match.p2_points : 0,
        winner:
          match.p1_points > match.p2_points
            ? players[0][0]
            : match.p2_points == match.p1_points
            ? null
            : players[1][0],
        is_dq: match?.is_dq ? match.is_dq : false,
        is_active: match?.ended_at == null,
        prize_usd_cents: match?.prize_usd_cents,
        age: Math.floor((new Date() - match.created_at) / 1000),
        ended_at: match?.ended_at ? match.ended_at : null,
      };
      return res;
    });
    return res;
  }
}
