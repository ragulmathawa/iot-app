const express = require('express')
const https = require('https');
const fs = require("fs");
const app = express()
const serveStatic = require('express-static-gzip');
const history = require('connect-history-api-fallback');
const MongoClient = require("mongodb").MongoClient;
const cors = require('cors');
const port = parseInt(process.env.PORT) || 3000;
const dbName = process.env.DB_NAME || "iotdb";
const dbHost = process.env.DB_HOST || "localhost"
const sslPort = parseInt(process.env.SSL_PORT) || 8082
const sslKey = process.env.SSL_KEY || "./key.pem";
const sslCert = process.env.SSL_CERT || "./cert.pem";
const apiRouter = require("./src/api");

async function main() {
  var db;
  try {
    let url = `mongodb://${dbHost}/${dbName}`;
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect()
    db = client.db(dbName);
    console.log(`DB "${dbHost}/${dbName}" Connected `)
  } catch (err) {
    console.error("DB connection Error", err);
  }

  const secureApp = express();
  initApp(app, db);
  initApp(secureApp, db);
  app.listen(port, async () => { console.log(`IOT app listening on port ${port}!`); })
  if (sslPort && sslCert && sslKey) {
    https.createServer({
      key: fs.readFileSync(sslKey),
      cert: fs.readFileSync(sslCert),
    }, secureApp).listen(sslPort, () => {
      console.log("IOT app listening on Secure port " + sslPort);
    })
  }
}

function initApp(app, db) {
  let corsOptions = {
    origin: "*"
  }
  app.use(cors(corsOptions))
  app.use('/api', apiRouter(db));
  app.use(history());
  app.use(
    serveStatic(__dirname + '/dist/', {
      enableBrotli: true,
      orderPreference: ['br', 'gz']
    })
  );
}
main()