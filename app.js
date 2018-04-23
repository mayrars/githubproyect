const express = require('express')
const request = require('request')

var app = express()
var options = {
    headers: { 'user-agent': 'node.js' }
};


var admin = require("firebase-admin");

var serviceAccount = require("./github-proyect-firebase-adminsdk-43ns1-fbc24da339.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://github-proyect.firebaseio.com"
});

var defaultDatabase = admin.database()
var ref = defaultDatabase.ref('/')

app.get("/getUser/:id", (req, res) => {
    userdata(req.params.id).then(
        repos(req.params.id)
    )
})

function userdata(userid) {
    return new Promise((resolve, reject)=>{
        request(`https://api.github.com/users/${userid}`, options, (error, response, body) => {
            return resolve(body)
        })
    })
}

function repos(userid) {
    return new Promise((resolve, reject)=>{
        request(`https://api.github.com/users/${userid}/repos`, options, (error, response, body) => {
            return resolve(body)
        })
    })
}

function saveuser(user) {
    ref.push(user)
}
app.listen(process.env.PORT || 3000, () => {

})