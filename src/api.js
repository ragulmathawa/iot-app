// @ts-check
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const Db = require("mongodb").Db;
const moment = require("moment");
const utils = require("./utils");
/**
 * Device Schema
 * {
 *      name: String,
 *      mac: String
 * }
 * 
 * HourlyStats
 * {
 *      timestamp_hour: Number,
 *      key: String,
 *      device: String,
 *      values:{
 *          3:{
 *              45:124,
 *              57:123
 *          }
 *      }
 * }
 */

/**
 * 
 * @param {Db} db
 */
function routes(db) {
    const router = express.Router()
    router.use(morgan('combined'))
    // const Schema = mongoose.Schema;
    router.use(bodyParser.json());
    router.get("/device", async (req, res) => {
        let devices = await db.collection("devices").find().toArray();
        return res.json(devices);
    });

    router.get("/device/:deviceMac/stats/:key", async (req, res) => {
        let mac = req.params['deviceMac'];
        let key = req.params['key'];
        let from = parseInt(req.query['from']) || moment().subtract(1,'hour').toDate().getTime();
        let to = parseInt(req.query['to']) || Date.now();
        if(from>to){
            return res.status(400).json({
                error:"from value cannot be later than to"
            })
        }
        
        let from_hour = new Date(from).setMinutes(0,0,0);
        let to_hour = new Date(to).setMinutes(0,0,0);
        let stats = await db.collection("hourlystats")
                        .find({ 
                            "device": mac, 
                            "key": key, 
                            $and:[
                                { "timestamp_hour": {$gte:from_hour}},
                                { "timestamp_hour": {$lte:to_hour}}
                            ] 
                        }).toArray();
        return res.json(utils.flattenStats(stats,from,to));
    });
    router.post("/device/:deviceMac/stats", async (req, res) => {
        let mac = req.params['deviceMac'];
        let key = req.body.key;
        let timestamp = req.body.timestamp || Date.now();
        let value = req.body.value;
        if (!key) {
            return res.status(400).json({
                error: "Missing stats key"
            })
        }
        let device = await db.collection("devices").findOne({ mac: mac });
        if (!device) {
            return res.status(404).json({
                error: "Device not found"
            });
        }
        let time = new Date(timestamp);
        let time_hour = new Date(timestamp);
        time_hour.setMinutes(0, 0, 0);
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        let path = "values." + minutes + "." + seconds
        let setObj = {}
        setObj[path] = value;
        await db.collection("hourlystats")
            .updateOne({
                device: device.mac,
                timestamp_hour: time_hour.getTime(),
                key: key
            }, { $set: setObj }, { upsert: true })
        res.status(200).send();
    });
    router.post("/device", async (req, res) => {
        let mac = req.body.mac;
        let name = req.body.name;
        if (!mac || !name) {
            return res.status(400).json({
                error: "Missing request body parameters"
            })
        }
        await db.collection("devices").updateOne({ mac: mac }, { $set: { name: name } }, { upsert: true });
        return res.status(204).json();
    })

    router.put("/device/:deviceMac", async (req, res) => {
        let mac = req.params["deviceMac"];
        if(req.body && req.body.mac){
            delete req.body.mac;
        }
        await db.collection("devices").findOneAndUpdate({mac:mac}, {$set:req.body});
        return res.status(204).json();
    })
    router.get("/device/stats", (req, res) => {
        res.status(200).send();
    });
    return router;
}

module.exports = routes