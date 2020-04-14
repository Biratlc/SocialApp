const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

const firebase = require("firebase");

admin.initializeApp();

const config = {
  apiKey: "AIzaSyCv1TDYCDCZuF0CUzlT8g07-LftqFQzuYM",
  authDomain: "socialapp-df35c.firebaseapp.com",
  databaseURL: "https://socialapp-df35c.firebaseio.com",
  projectId: "socialapp-df35c",
  storageBucket: "socialapp-df35c.appspot.com",
  messagingSenderId: "940761753601",
  appId: "1:940761753601:web:770785f45af940fc633800",
  measurementId: "G-FERNGGNZ4Q",
};

firebase.initializeApp(config);
app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      return res
        .status(201)
        .json({ message: `user ${data.user.uid} signed up successfully` });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

exports.api = functions.https.onRequest(app);
