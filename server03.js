var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;
var path = require("path")
var hbs = require('express-handlebars');
const Datastore = require('nedb')

const coll3 = new Datastore({
    filename: 'kolekcja3.db',
    autoload: true
});

// coll3.remove({}, { multi: true }, function (err, numRemoved) {
//         console.log("usunięto wszystkie dokumenty: ",numRemoved)  
//     });

const context = {
    dane: ["ubezpieczony", "benzyna", "uszkodzony", "naped"],
    wszystkie: []
}

coll3.find({}, function (err, docs) {
    context.wszystkie = docs
});

app.use(express.static('static'))

app.get("/", function (req, res) {
    res.render('index2.hbs', context);
})

app.get("/form", function (req, res) {

    let obj = {
        a: req.query.ubezpieczony == "on" ? "TAK" : "NIE",
        b: req.query.benzyna == "on" ? "TAK" : "NIE",
        c: req.query.uszkodzony == "on" ? "TAK" : "NIE",
        d: req.query.naped == "on" ? "TAK" : "NIE",
        id: 1
    }

    coll3.insert(obj, function (err, newDoc) {
        console.log("dodano dokument (obiekt):")
        console.log(newDoc)
        console.log("losowe id dokumentu: " + newDoc._id)

        coll3.find({}, function (err, docs) {
            context.wszystkie = docs
            res.render('index2.hbs', context);
        });
    });
})


app.get("/usun", function (req, res) {
    console.log(req.query);
    console.log(req.query.delete);
    console.log(req.query.delete);

    coll3.remove({ _id: req.query.delete }, {}, function (err, numRemoved) {
        console.log("usunięto dokumentów: ", numRemoved)
        coll3.find({}, function (err, docs) {
            context.wszystkie = docs
            res.render('index2.hbs', context);
        });

    });
})

app.get("/edit", function (req, res) {
    let editId = req.query.edit
    coll3.find({ _id: editId }, function (err, docs) {
        docs[0].id = 0
        coll3.update({ _id: editId }, { $set: docs[0] }, {}, function (err, numUpdated) {
            console.log("zaktualizowano " + numUpdated)
            coll3.find({}, function (err, docs) {
                context.wszystkie = docs
                res.render('index2.hbs', context);
            });
        });
    });
    
})

app.get("/cancel", function (req, res){
    let editId = req.query.cancel
    coll3.find({ _id: editId }, function (err, docs) {
        docs[0].id = 1
        coll3.update({ _id: editId }, { $set: docs[0] }, {}, function (err, numUpdated) {
            console.log("zaktualizowano " + numUpdated)
            coll3.find({}, function (err, docs) {
                context.wszystkie = docs
                res.render('index2.hbs', context);
            });
        });
    });
})

app.get("/update", function (req, res){
    let updateId = req.query.update
    coll3.find({ _id: updateId }, function (err, docs) {
        let obj = {
            a: req.query.ubezpieczony == "on" ? "TAK" : "NIE",
            b: req.query.benzyna == "on" ? "TAK" : "NIE",
            c: req.query.uszkodzony == "on" ? "TAK" : "NIE",
            d: req.query.naped == "on" ? "TAK" : "NIE",
            id: 1
        }
        coll3.update({ _id: updateId }, { $set: obj }, {}, function (err, numUpdated) {
            console.log("zaktualizowano " + numUpdated)
            coll3.find({}, function (err, docs) {
                context.wszystkie = docs
                res.render('index2.hbs', context);
            });
        });
    });
})


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
}));


