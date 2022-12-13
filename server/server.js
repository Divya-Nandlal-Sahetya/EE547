const express = require("express");
const fs = require("fs");
const { graphqlHTTP } = require("express-graphql");
const DataLoader = require("dataloader");
require("dotenv").config();
const {
  assertResolversPresent,
  makeExecutableSchema,
} = require("@graphql-tools/schema");

const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const node_port = 8080;

let mongo_file_path =process.env.MONGO_CONFIG;
const config = require(mongo_file_path);

(async function () {
  host = config.host || "localhost";
  port = config.port || 27017;
  opts = config.opts || { useUnifiedTopology: true };
  const connection = new MongoClient("mongodb://" + host + ":" + port, opts);

  database = config.db || "ee547_project";

  await connection.connect();
  db = connection.db(database);

  const typeDefs = fs.readFileSync(process.env.SCHEMA_GRAPHQL).toString("utf-8");

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
            person: new DataLoader((keys) => getPersons(db, keys)),
            subject: new DataLoader((keys) => getSubjects(db, keys)),
            gradebook: new DataLoader((keys) => getGradebook(db, keys)),
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
    console.log("GraphQL API server running at http://localhost:8080/graphql");
  }
})();

//GET PERSONS
async function getPersons(db, keys) {
  // keys = keys.map((key) => ObjectId(key));
  let persons = await db
    .collection("person")
    .find({ emailid: { $in: keys } })
    .toArray();
  return (
    formatPerson(persons) ||
    new Error((message = `persons collection does not exist `))
  );
}


//GET SUBJECTS
async function getSubjects(db, keys) {
  keys = keys.map((key) => ObjectId(key));
  let subjects = await db
    .collection("subject")
    .find({ _id: { $in: keys } })
    .toArray();
  return (
    formatSubject(subjects) ||
    new Error((message = `subjects collection does not exist `))
  );
}

//GET GRADEBOOK
async function getGradebook(db, keys) {
  // keys = keys.map((key) => ObjectId(key));
  let gradebook = await db
    .collection("gradebook")
    .find({ emailid: { $in: keys } })
    .toArray();
  return (
    formatGradebook(gradebook) ||
    new Error((message = `gradebook collection does not exist `))
  );
}

("use strict");

const resolvers = {
  Mutation: {

    personCreate: async (_, { personInput }, context) => {
      let person = {
        fname: personInput.fname,
        lname: personInput.lname,
        role: enum_role[personInput.role],
        is_active: personInput.is_active ? personInput.is_active:true,
        gpa: personInput.gpa?personInput.gpa:null,
        emailid: personInput.emailid?personInput.emailid:null,
      };
      let res = await context.db.collection("person").insertOne(person);
      return context.loaders.person.load(res.insertedId)  ;
    },

    personDelete: async (_, { id }, context) => {
      let res = await context.db.collection("person").deleteOne({ _id: ObjectId(id) });
      if (res.deletedCount > 0) {
        return true;
      } else {
        return false;
      }
    },

    personUpdate: async (_, { id, personInput }, context) => {
      let updated_dict = {}
      if(personInput.lname!=null){
        updated_dict["lname"] = personInput.lname
    }
    if(personInput.is_active!=null){
        updated_dict["is_active"] = personInput.is_active;
    }
    if(personInput.gpa!=null){
        updated_dict["gpa"] = personInput.gpa;
    }

      let res = await context.db.collection("person").updateOne(
        { _id: ObjectId(id) },
        {
          $set:   updated_dict
        }
      )
      context.loaders.person.clear(id);
      return context.loaders.person.load(id);
    },

    subjectCreate: async (_, { subjectInput }, context) => {
      let subject = {
        name: subjectInput.name,
        code: subjectInput.code,
        is_active: subjectInput.is_active? subjectInput.is_active:true,
      };
      let res = await context.db.collection("subject").insertOne(subject);
      return context.loaders.subject.load(res.insertedId);
    },

    subjectDelete: async (_, { id }, context) => {
      let res = await context.db.collection("subject").deleteOne({ _id: ObjectId(id) });
      if (res.deletedCount > 0) {
        return true;
      } else {
        return false;
      }
    },

    subjectUpdate: async (_, { id, subjectInput }, context) => {
      let updated_dict = {}
      if(subjectInput.name!=null){
        updated_dict["name"] = subjectInput.name
    }
    if(subjectInput.is_active!=null){
        updated_dict["is_active"] = subjectInput.is_active;
    }
      let res = await context.db.collection("subject").updateOne(
        { _id: ObjectId(id) },
        {
          $set:   updated_dict
        }
      )
      context.loaders.subject.clear(id);
      return context.loaders.subject.load(id);
    },

    gradebookCreate: async (_, { gradebookInput }, context) => {
      let gradebook = {
        student_id: ObjectId(gradebookInput.student_id),
        subject: gradebookInput.subject,
        grade: gradebookInput.grade,
        gpa: gradebookInput.gpa,

      };
      let res = await context.db.collection("gradebook").insertOne(gradebook);
      console.log(res.insertedId);
      return context.loaders.gradebook.load(res.insertedId);
    },

    gradebookDelete: async (_, { id }, context) => {
      let res = await context.db.collection("gradebook").deleteOne({ _id: ObjectId(id) });
      if (res.deletedCount > 0) {
        return true;
      } else {
        return false;
      }
    },

    gradebookUpdate: async (_, { id, gradebookInput }, context) => {
      let updated_dict = {}
      if(gradebookInput.grade!=null){
        updated_dict["grade"] = gradebookInput.grade
    }
    if(gradebookInput.gpa!=null){
        updated_dict["gpa"] = gradebookInput.gpa;
    }
      let res = await context.db.collection("gradebook").updateOne(
        { _id: ObjectId(id) },
        {
          $set:   updated_dict
        }
      )
      context.loaders.gradebook.clear(id);
      return context.loaders.gradebook.load(id);
  }
},

  Query: {
    person: (_, { emailid }, context) => {
      return context.loaders.person.load(emailid);
    },

    persons: async (_, { limit = 20, offset = 0, sort = null }, context) => {
      let persons = await context.db.collection("person").find().toArray();
      if (persons == null) return null;
      if (sort != null) {
        persons.sort((a, b) => {
          if (a[sort] < b[sort]) {
            return -1;
          }
          if (a[sort] > b[sort]) {
            return 1;
          }
          return 0;
        });
      }
      return persons.slice(offset, offset + limit).map(formatPerson);
    },

    teacher: (_, { id }, context) => {
      return context.loaders.person.load(id);
    },

    teachers: async (_, { limit = 20, offset = 0, sort = null }, context) => {
      let teachers = await context.db.collection("person").find({ role: "T" }).toArray();
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
      return teachers.slice(offset, offset + limit).map(formatPerson);
    },


    student: (_, { emailid }, context) => {
      return context.loaders.person.load(emailid);
    },

    students: async (_, { limit = 20, offset = 0, sort = null }, context) => {
      let students = await context.db.collection("person").find({ role: "S" }).toArray();
      if (students == null) return null;
      if (sort != null) {
        students.sort((a, b) => {
          if (a[sort] < b[sort]) {
            return -1;
          }
          if (a[sort] > b[sort]) {
            return 1;
          }
          return 0;
        });
      }
      return students.slice(offset, offset + limit).map(formatPerson);
    },

    subject: (_, { id }, context) => {
      return context.loaders.subject.load(id);
    },

    subjects: async (_, { limit = 20, offset = 0, sort = null }, context) => {
      let subjects = await context.db.collection("subject").find().toArray();
      if (subjects == null) return null;
      if (sort != null) {
        subjects.sort((a, b) => {
          if (a[sort] < b[sort]) {
            return -1;
          }
          if (a[sort] > b[sort]) {
            return 1;
          }
          return 0;
        });
      }
      return subjects.slice(offset, offset + limit).map(formatSubject);
    },

    gradebook: (_, { id }, context) => {
      return context.loaders.gradebook.load(id);
    },

    gradebooks: async (_, { limit = 20, offset = 0, sort = null }, context) => {
      let gradebooks = await context.db.collection("gradebook").find().toArray();
      if (gradebooks == null) return null;
      if (sort != null) {
        gradebooks.sort((a, b) => {
          if (a[sort] < b[sort]) {
            return -1;
          }
          if (a[sort] > b[sort]) {
            return 1;
          }
          return 0;
        });
      }
      return gradebooks.slice(offset, offset + limit).map(formatGradebook);
    }

  },
};

//FORMAT PERSON
function formatPerson(person) {
  if (person == null) return null;
  if (Array.isArray(person)) {
    return person.map(formatPerson);
  }

  let res = {
    pid: person._id,
    fname: person.fname,
    lname: person.lname,
    name: `${person.fname}${person.lname ? ` ${person.lname}` : ""}`,
    role: rev_enum_role[person.role],
    is_active: person.is_active,
    gpa: person.gpa?person.gpa:null,
    emailid: person.emailid,
  };
  return res;
}

//FORMAT SUBJECT
function formatSubject(subject) {
  if (subject == null) return null;
  if (Array.isArray(subject)) {
    return subject.map(formatSubject);
  }

  let res = {
    sid: subject._id,
    name: subject.name,
    code: subject.code,
    is_active: subject.is_active,
  };
  return res;
}

//FORMAT GRADEBOOK
function formatGradebook(gradebook) {
  if (gradebook == null) return null;
  if (Array.isArray(gradebook)) {
    return gradebook.map(formatGradebook);
  }

  let res = {
    id: gradebook._id,
    subject: gradebook.subject,
    grade: gradebook.grade,
    gpa: gradebook.gpa,
  };
  return res;
}

//ENUM FOR ROLE
const enum_role = {
  teacher: "T",
  student: "S",
  admin: "A",
};

const rev_enum_role = {
  T: "teacher",
  S: "student",
  A: "admin",
};

// dotenv
require("dotenv").config();
// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//cors
const cors = require("cors");
app.use(cors());

// node-fetch
const fetch = require("node-fetch");

const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:8080/handleGoogleRedirect" // server redirect url handler
);


app.post("/createAuthLink", cors(), (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      //calendar api scopes]
      "https://www.googleapis.com/auth/calendar",
      //gmail
      "profile",
      "https://mail.google.com/",
      //'https://www.googleapis.com/auth/gmail.metadata',
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.readonly"
    ],
    prompt: "consent",
  });
  res.send({ url });
});

app.get("/handleGoogleRedirect", async (req, res) => {
  // get code from url
  const code = req.query.code;
  console.log("server 36 | code", code);
  // get access token
  oauth2Client.getToken(code, (err, tokens) => {
    if (err) {
      console.log("server 39 | error", err);
      throw new Error("Issue with Login", err.message);
    }
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;
    res.redirect(
      `http://localhost:3000?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  });
});

app.post("/getValidToken", async (req, res) => {
  try {
    const request = await fetch("https://www.googleapis.com/oauth2/v4/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: req.body.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await request.json();
    console.log("server 74 | data", data.access_token);

    res.json({
      accessToken: data.access_token,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});