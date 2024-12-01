require('dotenv').config();
var express = require('express');
var router = express.Router();
const apiKey = process.env.API_NJ_KEY;
const opaiKey = process.env.OPENAI_PJ01_KEY;
const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');

const s3 = new AWS.S3();
const upload = multer({ storage: multer.memoryStorage() });

const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const JokeCon = require('./JokeCon');
const Chatllm = require('./Chatllm');
const GptVisual = require("./GptVisual");
const {response} = require("express");
const axios = require("axios");
const jokeCon = new JokeCon(apiKey);
const challm = new Chatllm(opaiKey);
const gptvisual = new GptVisual(opaiKey);

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,

})

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Image API Demo'});
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

router.post('/vision', async function (req, res, next) {

    const data = req.body;

    try {
        console.log(data);
        const jsonObject = await gptvisual.getVisual(data.value);
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: 'Failed',
            error: error.message,
        });
    }
});

router.post('/upload', upload.single('file'), async function (req, res, next) {
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${Date.now()}-${path.basename(req.file.originalname)}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
    };
    var imglocation = "";

    try {
        const data = await s3.upload(params).promise();

        // const getBase64FromUrl = async (url) => {
        //     try {
        //         const response = await axios.get(url, {responseType: 'arraybuffer'});
        //
        //         const base64String = Buffer.from(response.data, 'binary').toString('base64');
        //         console.log(base64String);
        //         return base64String;
        //     } catch (error) {
        //         console.error('Error fetching base64 from url', error);
        //     }
        // };
        const jsonObject = await gptvisual.getVisual(data.Location);

        console.log(jsonObject.content);
        res.status(200).json({message: 'Uploaded successfully', url:data.Location, answer: jsonObject.content});

    } catch (error) {
        res.status(500).json({error:'Error uploading file', details: error.message});
    }
});

router.get('/download/:filename', async function (req, res, next) {
    const fileKey = req.params.filename;

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: fileKey
    };

    try {
        const data = await s3.getObject(params).promise();
        res.setHeader('Content-Type', data.ContentType);
        res.send(data.Body);
    } catch (error) {
        res.status(500).json({error:'Error downloading file', details: error.message});
    }
});

module.exports = router;
