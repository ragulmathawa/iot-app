const express = require('express')
const app = express()
const serveStatic = require('express-static-gzip');
const history = require('connect-history-api-fallback');
const MongoClient =  require("mongodb").MongoClient;
const cors = require('cors');
const port = parseInt(process.env.PORT) || 8080;
const dbName = process.env.DB_NAME || "iotdb";
const dbHost = process.env.DB_HOST || "localhost"
const apiRouter = require("./src/api");

async function main(){
  var db;
  try{
    let url =`mongodb://${dbHost}/${dbName}`;
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect()
    db = client.db(dbName);
    console.log(`DB "${dbHost}/${dbName}" Connected `)
  }catch(err){
    console.error("DB connection Error",err);
  }  
  let corsOptions = {
    origin:"*"
  }
  app.use(cors(corsOptions))

  app.use('/api',apiRouter(db));
  app.use(history());
  app.use(
    serveStatic(__dirname + '/dist/', {
      enableBrotli: true,
      orderPreference: ['br', 'gz']
    })
  );

  app.listen(port, async () =>{ console.log(`IOT app listening on port ${port}!`);})
}
main()