const express = require('express');
const { Op } = require('sequelize');

const { Post, Image, User, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    //게시글이 20까지 있을때.. 21게시글을 작성한다면 11번 게시글을 2번 불러와서 중복되는 문제가 발생한다 (offset방식을 사용할때)
    //그래서 여기서 lastId로 게시글을 불러온다
    //lastId로 고정을 시킨다면.. 21번 게시글을 작성하더라도 11번 게시글을 보다 밑에것을 불러오기 때문에 중복으로 가져오는 문제가 없어진다
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'], //
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: User,  //작성자 정보도 같이 넣기
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }],
    });
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
