var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();


const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'user_profiles',
    user: 'postgres',
    password: 'postgres123'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

app.get('/', function (req, res) {
    res.render('pages/login', {
        title: "Fakebook | Login"
    });
});

app.get('/register', function (req, res) {
    res.render('pages/register', {
        title: "Fakebook | Register"
    });
});

app.get('/myProfile', function (req, res) {
    var userName = req.query.user_name;
    var query = 'select * from users where name = ' + userName + ';';
    db.any(query)
        .then(function (rows) {
            res.render('/pages/myProfile', {
                title: userName + "'s Fakebook Profile",
                data: rows
            })
        })
        .catch(function (err) {
            request.flash('error', err);
            response.render('/pages/myProfile', {
                title: "",
                data: ""
            })
        })
});