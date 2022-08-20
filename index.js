var express = require('express');
var app = express();

let comments = [];

// Sqlite Setting 
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'databse.sqlite'
});

const Commnets = sequelize.define('Commnets', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

(async () => {
await Commnets.sync();
})();

// `sequelize.define` also returns the model
console.log(Commnets === sequelize.models.Commnets); // true


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', async function(req, res) {
    // Select Commnets
    const comments = await Commnets.findAll();

    console.log(comments);

    res.render('index',{comments:comments});
});

// post
app.post('/create', async function(req, res) {
    console.log(req.body);

    const { content } = req.body;

    // Create Commnets
    await Commnets.create({ content: content });

    comments.push(content);

    //console.log(comments);
    //res.send("안녕하세요");

    res.redirect('/');
});

app.post('/update/:id', async function(req, res) {
    console.log(req.params);
    console.log(req.body);

    const { content } = req.body;
    const { id } = req.params;

    // Update Commnets
    await Commnets.update({ content: content }, {
        where: {
            id: id
        }
    });
    res.redirect('/');
});

app.post('/delete/:id', async function(req, res) {
    console.log(req.params);

    const { id } = req.params;

    // Delete Commnets
    await Commnets.destroy({
        where: {
            id: id
        }
    });
    res.redirect('/');
});

app.listen(3000);
console.log('Server is listening on port 3000');