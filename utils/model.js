import {Sequelize, sequelize} from './mysql'
const isEmptyObject = (e)=>{
    var t;
    for (t in e)
        return !1;
    return !0
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
    attrs = {id:{type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true}, ...attrs}
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
            beforeUpdate: function (obj) {
              console.log('beforeUpdate!!!!!!!!!!!!!!!!!!');
              obj.updatedAt = Date.now();
              obj.version++;
            },
            beforeValidate: function (obj,option) {
                // console.log('!!!!!!!!!!!!!!!!!!');
                // console.log(option);
                // console.log(obj.isNewRecord);
                // console.log('!!!!!!!!!!!!!!!!!!');
                // TODO 这里 obj.isNewRecord 值一直为 true, 原因未知
                // 且下面为obj赋值的代码,只有在插入数据的时候有效,更新时并不会同步到数据库
                if (obj.isNewRecord) {
                    // if (!obj.id) {
                    //     obj.id = generateId();
                    // }
                    let now = Date.now();
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
const initTable = ({fields, table, entity})=>{
  const _fields = JSON.parse(JSON.stringify(fields));

  const Model = defineModel(table, fields);

  const build = ()=>{
    if(table=='users' || table=="address"){
      Model.sync({force: true}).then(() => {
        if(entity && !isEmptyObject(entity)){
          return Model.create(entity);
        }
      })
    }
  }
  // 增 C
  const create = async (model)=>{
    return await Model.create(model);
  }
  // 查 R
  const retrieve = async ({id, query})=>{
    if(id){
      var _r = {};
      await Model.findById(id).then(function(res){
        _r = res || _r
      });
      return _r;
    }else {
      var models = []
      await Model.findAll(query).then(res => {
        models = res;
      });
      return models;
    }
  }
  // 改 U
  const update = async (model)=>{
    var rst=[], id=model.id;
    delete model.id
    await Model.update(
      { ...model, updatedAt:Date.now() },
      { where: { id }}
    ).then((res)=>{
      rst = res;
    });
    return rst;
  }
  // 删 D
  const del = async ids=>{
    var rst=[];
    await Model.destroy({
      where:{id: {$in: ids}},
    }).then((res)=>{
      rst = res;
    });
    return rst;
  }
  const delByWhere = async where=>{
    var rst=[];
    await Model.destroy({
      where,
    }).then((res)=>{
      rst = res;
    });
    return rst;
  }
  return {
    fields : _fields,
    entity,
    Model,
    build,
    create,
    retrieve,
    update,
    del,
    delByWhere
  }
}
module.exports = {
  Sequelize,
  sequelize,
  initTable
}
