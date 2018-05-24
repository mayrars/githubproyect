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

app.get("/:id", (req, res, next) => {
    res.setHeader('Content-Type', 'text/json')
    userdata(req.params.id)
    .then(repos)
    .then(response=>{
        saveuser(response)
        res.send(JSON.stringify(response))
    }).catch(error =>{
        res.status(500)
        res.send(JSON.stringify(error))
    })

})

function userdata(userid) {
    return new Promise((resolve, reject)=>{
        request(`https://api.github.com/users/${userid}`, options, (error, response, body) => {
            if(error)
                return reject(error)
            return resolve(JSON.parse(body))
        })
    })
}

function repos(res) {
    return new Promise((resolve, reject)=>{
        request(`https://api.github.com/users/${res.login}/repos`, options, (error, response, body) => {
            if(error)
                return reject(error)
            var user = {}
            user.user = res
            user.repos = JSON.parse(body)
            return resolve(user)
        })
    })
}

function saveuser(user) {
    ref.push(user)
}
app.listen(process.env.PORT || 3000, () => {

})