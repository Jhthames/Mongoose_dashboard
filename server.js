const express = require("express");
const app = express();
const mongoose = require('mongoose');
const server = app.listen(7000, () => console.log("listening on port 7000"));
const flash = require('express-flash');
app.use(flash());
const session = require('express-session');

app.use(session({
    secret: 'skippy',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

mongoose.connect('mongodb://localhost/hello_DB', {useNewUrlParser: true});

const AnimalSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 4},
    myth: { type: String, required: true, maxlength: 100 },
}, {timestamps: true });

const Animal = mongoose.model('Animal', AnimalSchema); 

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views');
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    Animal.find()
        .then(data => res.render("index", {animals: data}))
        .catch(err => res.json(err));
});
app.post('/cats', (req, res) =>{
    console.log(req.body)
    const animal = new Animal();
    animal.name = req.body.name;
    animal.myth = req.body.myth;
    animal.save()
        .then(() => res.redirect('/cats'))
            //newUser => console.log('user created: ', newUser))
        //.catch(err => res.json(err));
        .catch(err => {
            console.log("We have an error!", err);
            // adjust the code below as needed to create a flash message with the tag and content you would like
            for (var key in err.errors) {
                req.flash('registration', err.errors[key].message);
            }
            res.redirect('/');
        })})
        app.get('/cats', (req, res) => {
            Animal.find()
                .then(animals => res.render("cats", {all_animals: animals}))
                .catch(err => res.json(err));
        });
        app.get('/cats/delete/:id', (req, res) => {
            Animal.deleteOne({_id: req.params.id})
                .then(succes =>{
                    console.log("RECORD DELETED")
                    res.redirect('/cats');
                })
                .catch(err=> {
                    console.log(err)
                    res.redirect('/')
                })
            })
        app.get('/cats/edit/:id',(req,res) => {
            Animal.updateOne({_id:req.params.id})
            .then(oneAnimal => res.render("edit", {animal: oneAnimal}))
            .catch(err => res.render("edit", {animal: err}))
            })
            app.post("/cats/:id", (req,res) =>{
                Animal.updateOne({_id:req.params.id}),{
                name: req.body.name,
                myth: req.body.myth
                }
            })
