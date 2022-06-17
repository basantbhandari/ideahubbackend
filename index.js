var express = require("express");
var app = express();
// setting of firebase
var fs = require("fs");
var admin = require("firebase-admin");
var serviceAccount = require("./node-todo-list-fffec-firebase-adminsdk-wqvuy-ed38002411.json");
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
var port = process.env.PORT || 3000;
// lets use express body parser
var bodyParser = require("body-parser");
app.use(bodyParser.json())
// import cors module
var cors = require("cors");

const {v4: uuidv4} = require('uuid')
const db = admin.firestore();
// to prevent CORS errors
app.use(cors());




// lets work with files
var data ={}



// get all todos
app.get("/read_todos", function(req, res) {
    // get all the todos from firestore
    db.collection("usertodos").get().then(function(querySnapshot) {
        // loop through the todos
        data = {}
        querySnapshot.forEach(function(doc) {
            // add the todo to the data object
            data[doc.id] = doc.data();
        });
        // send the data back to the frontend
        res.send(data);
    });
});
    


// get todo by id
app.get("/read_todo/:id", function(req, res) {
    // read a perticular data from the database
    db.collection("usertodos").doc(req.params.id).get().then(function(doc) {
        // send the data back to the frontend
        res.send(doc.data());
        console.log("Document data:", doc.data());
    });
});


// create todo
app.post("/create_todo", function(req, res) {
    res.setHeader('Content-Type', 'text/plain')
    data = {}
    const newId = uuidv4()
    data[newId] = {
        name: req.body.name,
        time: req.body.time,
        isProgress: req.body.isProgress,
        isDone: req.body.isDone,
        isDeleted: req.body.isDeleted,
        isCanceled: req.body.isCanceled,
        isMissed: req.body.isMissed,
        isLate: req.body.isLate
    };
    // write to the database
    db.collection("usertodos").add(data[newId])
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    res.send(data[newId]);
});

// update todo
app.put("/update_todo/:id", function(req, res) {
    // update a perticular data from the database
    db.collection("usertodos").doc(req.params.id).update(req.body)
    .then(function() {
        console.log("Document successfully updated!");
    })
    .catch(function(error) {
        console.error("Error updating document: ", error);
    });
    res.send(req.body);
});


// delete todo
app.delete("/delete_todo/:id", function(req, res) {
    // delete a perticular data from the database
    db.collection("usertodos").doc(req.params.id).delete()
    .then(function() {
        console.log("Document successfully deleted!");
    })
    .catch(function(error) {
        console.error("Error removing document: ", error);
    });
    res.status(200).send("ok");
});


// delete all todos
app.delete("/delete_all_todos", function(req, res) {
    // delete all the data from the database
    db.collection("usertodos").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            db.collection("usertodos").doc(doc.id).delete();
        });
    });
    res.send("All todos deleted");
})





//  default route
app.get("/", function(req, res) {
    res.send("Hello World!");
});

// listen on the port
app.listen(port, function () {
    console.log("listening on port " + port);
});





