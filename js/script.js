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

let mongo_file_path = "/home/kd/Documents/USC/EE547/Project/EE547/js/config/mongo.json";
const config = require(mongo_file_path);

(async function () {
  host = config.host || "localhost";
  port = config.port || 27017;
  opts = config.opts || { useUnifiedTopology: true };
  const connection = new MongoClient("mongodb://" + host + ":" + port, opts);

  database = config.db || "ee547_project";

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
            semesters: new DataLoader((keys) => getSemesters(db, keys)),
            subjects: new DataLoader((keys) => getSubjects(db, keys)),
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


//GET TEACHERS
async function getTeachers(db, keys) {
   const teachers = await db.collection("teachers").find().toArray();
   return keys.map((key) => teachers.find((teacher) => teacher._id == key));
}

//GET STUDENTS
async function getStudents(db, keys) {
   const students = await db.collection("students").find().toArray();
   return keys.map((key) => students.find((student) => student._id == key));
}

// //GET SEMESTERS
// async function getSemesters(db, keys) {
//   keys = keys.map((key) => ObjectId(key));
//   let semesters = await db
//     .collection("semester")
//     .find({ _id: { $in: keys } })
//     .toArray();
//   return (
//    semesters.map(formatSemester) ||
//     new Error((message = `semesters collection does not exist `))
//   );
// }

// //GET SUBJECTS
// async function getSubjects(db, keys) {
//   keys = keys.map((key) => ObjectId(key));
//   let subjects = await db
//     .collection("subject")
//     .find({ _id: { $in: keys } })
//     .toArray();
//   return (
//     formatStudent(subjects) ||
//     new Error((message = `subjects collection does not exist `))
//   );
// }


("use strict");

const resolvers = {
  Mutation: {
    teacherCreate: async (_, { playerInput }, context) => {
      let teacher = {
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
      let res = await context.db.collection("teacher").insertOne(teacher);
      return context.loaders.teacher.load(res.insertedId);
    },
    //Student Create
    studentCreate: async (_, { playerInput }, context) => {
      let teacher = {
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
      let res = await context.db.collection("teacher").insertOne(teacher);
      return context.loaders.teacher.load(res.insertedId);
    },
  },
  Query: {
    teacher: (_, { tid }, context) => {
      return context.loaders.teacher.load(tid);
    },
    teachers: async (_, { limit = 20, offset = 0, sort = null }, context) => {
      let teachers = await context.db.collection("teacher").find().toArray();
      if (teachers == null) return null;
      if (sort != null) {
        teachers.sort((a, b) => {
          if (a[sort] < b[sort]) {
            return -1;
          }
          if (a[sort] > b[sort]) {
            return 1;
          }
          return 0;
        });
      }
      return teachers.slice(offset, offset + limit).map(formatTeacher);
    },
    student: (_, { sid }, context) => {
      return context.loaders.student.load(sid);
    },
    students: async (_, { limit = 20, offset = 0, sort = null }, context) => {
      return result.slice(offset, offset + limit);
    },
    teacher: {
      userId: ({ user_id }, _, context) => {
        return user_id;
      },
    },
  },
};


//FORMAT TEACHER
function formatTeacher(teacher) {
  if (teacher == null) return null;
  if (Array.isArray(teacher)) {
    return teacher.map(formatTeacher);
  }

  let res = {
    tid: teacher._id,
  };
  return res;
}

//FORMAT STUDENT
// function formatStudent(student) {
//   if (student == null) return null;
//   if (Array.isArray(student)) {
//     return Promise.all(student.map(formatStudent));
//   } else {
//     let res = Promise.all([
//       db
//         .collection("teacher")
//         .find({ _id: ObjectId(student.s1_id) })
//         .toArray(),
//       db
//         .collection("teacher")
//         .find({ _id: ObjectId(student.s2_id) })
//         .toArray(),
//     ]).then((teachers) => {
//       teachers = formatTeacher(teachers);
//       res = {
//         sid: student._id,
//       };
//       return res;
//     });
//     return res;
//   }
// }
