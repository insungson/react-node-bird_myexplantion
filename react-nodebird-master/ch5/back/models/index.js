const Sequelize = require('sequelize');
const comment = require('./comment');
const hashtag = require('./hashtag');
const image = require('./image');
const post = require('./post');
const user = require('./user');

const env = process.env.NODE_ENV || 'development'; //환경변수는 나중에 crossenv로 배포버전으로 바꾼다.
const config = require('../config/config')[env]; //는 DB와 연결하는 설정부분이다.
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
//시퀄라이즈가 노드와 마이sql을 연결해준다.

db.Comment = comment;
db.Hashtag = hashtag;
db.Image = image;
db.Post = post;
db.User = user;

Object.keys(db).forEach(modelName => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
