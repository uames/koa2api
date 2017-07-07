const Sequelize = require('sequelize')
const fs = require('fs')

let name = 'root', pwd = '123456', host = '127.0.0.1';
if(process.env.NODE_ENV=='production'){
  name = 'root';
  pwd = '123456';
  host = 'localhost';
}

const sequelize = new Sequelize('shop', name, pwd, {
  host: host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

const connect = ()=>{
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      // scan tables and build
      if(process.env.BuildTables){
        var files = fs.readdirSync(__dirname + '/models');
        for (var f of files) {
            console.log(`build table: ${f}...`);
            let table = require(__dirname + '/models/' + f)
            table.build();
        }
      }
  }).catch(err => {
      console.error('Unable to connect to the database:', err);
  });
}
const defineModel = (name, attributes)=>{
    var attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    attrs.id = attrs.id? attrs.id:{type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true};
    attrs.createdAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.updatedAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if (obj.isNewRecord) {
                    // if (!obj.id) {
                    //     obj.id = generateId();
                    // }
                    obj.createdAt = now;
                    obj.updatedAt = now;
                    obj.version = 0;
                } else {
                    obj.updatedAt = Date.now();
                    obj.version++;
                }
            }
        }
    });
}
module.exports = {
  connect: connect,
  Sequelize: Sequelize,
  sequelize: sequelize,
  defineModel: defineModel
}
