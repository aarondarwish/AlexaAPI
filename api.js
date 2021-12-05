const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;


// Dynasty
var credentials = {
    accessKeyId: '',
    secretAccessKey: '',
    region: "",
    endpoint: 'http://dynamodb.eu-west-1.amazonaws.com'
};
const dynasty = require('dynasty')(credentials);

// url: http://localhost:3000/
app.get('/', (request, response) => response.send('Welcome to Alexa Bridge API.'));

// all routes prefixed with /api
app.use('/api', router);

// using router.get() to prefix our path
// url: http://localhost:3000/api/
router.get('/', (request, response) => {
    response.json({ message: 'Hello, welcome to my server' });
});

// set the server to listen on port 3000
app.listen(port, () => console.log(`Listening on port ${port}`));

// Sending HTTP requests
const url = require('url');

router.get('/getAlexaId', (request, response) => {
    var urlParts = url.parse(request.url, true);
    var parameters = urlParts.query;
    var alexaId = parameters.alexaId;

    var table = dynasty.table('alexaId');
    var promise = table.find(alexaId)
    promise.then(function (table) {
        var myResponse = table;
        response.json(myResponse);
    });
});

router.get('/getRandomCode', (request, response) => {
    var urlParts = url.parse(request.url, true);
    var parameters = urlParts.query;
    var randomCode = parameters.randomCode;

    var table = dynasty.table('randomCode');
    var promise = table.find(randomCode)
    promise.then(function (table) {
        var myResponse = table;
        response.json(myResponse);
    });
});


router.get('/insertRandomCode', (request, response) => {
    var urlParts = url.parse(request.url, true);
    var parameters = urlParts.query;
    var alexaId = parameters.alexaId;
    var randomCode = parameters.randomCode;
    
    var table = dynasty.table('alexaId');
    table.insert({ alexaId: alexaId, randomCode: randomCode }).then(function(table) {
        var myResponse = "success";
        response.json(myResponse);
    });
});

router.get('/authenticate', (request, response) => {
    var urlParts = url.parse(request.url, true);
    var parameters = urlParts.query;
    var alexaId = parameters.alexaId;
    var clientName = parameters.clientName;
    
    var table = dynasty.table('alexaId');
    table.insert({ alexaId: alexaId, clientName: clientName }).then(function(table) {
        var myResponse = "success";
        response.json(myResponse);
    });
});

router.get('/deleteTable', (request, response) => {
    var urlParts = url.parse(request.url, true);
    var parameters = urlParts.query;
    var alexaId = parameters.alexaId;

    var table = dynasty.table('alexaId');
    var promise = table.find(alexaId)
    promise.then(function (table) {
        var myResponse = table;
        response.json(myResponse);
    });
});
// this array is used for identification of allowed origins in CORS
const originWhitelist = ['http://localhost:8989', 'https://example.net'];

// middleware route that all requests pass through
router.use((request, response, next) => {
    console.log('Server info: Request received');

    let origin = request.headers.origin;

    // only allow requests from origins that we trust
    if (originWhitelist.indexOf(origin) > -1) {
        response.setHeader('Access-Control-Allow-Origin', origin);
    }

    // only allow get requests, separate methods by comma e.g. 'GET, POST'
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);

    // push through to the proper route
    next();
});