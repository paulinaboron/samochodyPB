var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;
var path = require("path")
var hbs = require('express-handlebars');
const Datastore = require('nedb')

const coll2 = new Datastore({
    filename: 'kolekcja2.db',
    autoload: true
});

// coll2.remove({}, { multi: true }, function (err, numRemoved) {
//         console.log("usunięto wszystkie dokumenty: ",numRemoved)  
//     });

const context = {
    dane: ["ubezpieczony", "benzyna", "uszkodzony", "naped"],
    wszystkie: []
}

coll2.find({}, function (err, docs) {
    context.wszystkie = docs
});

app.use(express.static('static'))

app.get("/", function (req, res) {
    res.render('index.hbs', context);
})

app.get("/form", function (req, res) {

    let obj = {
        a: req.query.ubezpieczony == "on" ? "TAK" : "NIE",
        b: req.query.benzyna == "on" ? "TAK" : "NIE",
        c: req.query.uszkodzony == "on" ? "TAK" : "NIE",
        d: req.query.naped == "on" ? "TAK" : "NIE",
    }

    coll2.insert(obj, function (err, newDoc) {
        console.log("dodano dokument (obiekt):")
        console.log(newDoc)
        console.log("losowe id dokumentu: " + newDoc._id)
        
        coll2.find({}, function (err, docs) {
            context.wszystkie = docs
            res.render('index.hbs', context);
        });
    });
})


app.get("/usun", function (req, res) {
    console.log(req.query);
    console.log(req.query.btn);

    coll2.remove({ _id: req.query.btn }, {}, function (err, numRemoved) {
        console.log("usunięto dokumentów: ", numRemoved)
        coll2.find({}, function (err, docs) {
            context.wszystkie = docs
            res.render('index.hbs', context);
        });

    });
})


app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
