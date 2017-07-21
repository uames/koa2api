import Sequelize from 'sequelize'
import fs from 'fs'

let name = 'root', pwd = '123456', host = '127.0.0.1', database = 'shop';
if(process.env.NODE_ENV=='production'){
  name = 'www';
  pwd = 'aef224bc04fbacd1';
  host = 'rm-wz9f9rzs2g88uiw1q.mysql.rds.aliyuncs.com';
  database = 'mall';
}

const sequelize = new Sequelize(database, name, pwd, {
  host: host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
const cwd = process.cwd()
const connect = ()=>{
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      // scan tables and build
      if(process.env.BuildTables){
        var files = fs.readdirSync(cwd + '/models');
        // var files = fs.readdirSync(__dirname + '/models');
        for (var f of files) {
            console.log(`build table: ${f}...`);
            let table = require(cwd + '/models/' + f)
            // let table = require(__dirname + '/models/' + f)
            table.build();
        }
        return "";
      }
  }).catch(err => {
      console.error('Unable to connect to the database:', err);
  });
}

module.exports = {
  connect,
  Sequelize,
  sequelize
}
