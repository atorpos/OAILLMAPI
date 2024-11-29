require('dotenv').config();
var express = require('express');
var router = express.Router();
const apiKey = process.env.API_NJ_KEY;
const opaiKey = process.env.OPENAI_PJ01_KEY;

const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const JokeCon = require('./JokeCon');
const Chatllm = require('./Chatllm');
const jokeCon = new JokeCon(apiKey);
const challm = new Chatllm(opaiKey);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express_02'});
});

router.get('/joke/data', async function (req, res, next) {
    // const response = {
    //   status: 'success',
    //   message: 'Data retrieved successfully',
    //   data: {
    //     items: [1, 2, 3, 4, 5],
    //     apiKey: apiKey
    //   },
    //   timestamp: new Date().toISOString(),
    // };
    // res.status(200).json(response);
    try {
        const jokeData = await jokeCon.fetchJoke();
        const response = {
            status: 200,
            message: 'Data retrieved successfully',
            data: jokeData,
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed',
            error: error.message,
        });
    }
});

router.post('/joke', async function (req, res, next) {

    const data = req.body;

    try {
        console.log(data);
        const jsonObject = await challm.getChatllm(data.value);

        const response = {
            status: 200,
            message: 'Data retrieved successfully',
            data: jsonObject,
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed',
            error: error.message,
        });
    }


});

module.exports = router;
