'use strict';

const Service = require('egg').Service;
const jwt = require('../utils/jwt');
const path = require('path');
const fs = require('fs');
// const sd = require('silly-datetime');
// const mkdirp = require('mkdirp');

const awaitWriteStream = require('await-stream-ready').write;

const sendToWormhole = require('stream-wormhole');

class GoodService extends Service {
  // 创建轮播图
  async create(carouselPath) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const banner = await ctx.model.Banner.aggregate().sort({ id: -1 });
    const newBanner = new ctx.model.Banner({
      id: banner.length === 0 ? 1 : banner[0].id + 1,
      image_url: carouselPath,
      createTime: Math.round(new Date() / 1000),
    });
    newBanner.save();
    return [ 0, '创建轮播图成功', results[1], results[2] ];
  }
  // 所有商品的信息
  async list(page) {
    const { ctx, app } = this;
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Banner.find({}).ne('deleted', 0).countDocuments();
    if (!total) { return [ 404006, '暂无商品信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const goodResult = await this.ctx.model.Banner.find({}).ne('deleted', 0).skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有轮播图信息返回成功', goodResult, totals, page ];
  }
  // 删除商品
  async deleteBanner(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Banner.findOne({ id: params.id }).ne('deleted', 0);
    if (!check) { return [ -1, '该商品不存在或已经被软删除了' ]; }
    await this.ctx.model.Banner.updateOne({ id: check.id }, { deleted: 0 });
    return [ 0, `该商品软删除成功了，执行人是${results[3]}`, results[1], results[2] ];
  }

  // 保存banner图片
  async saveBannerImg(filename) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const fileBuffer = fs.createReadStream(filename.filepath);
    const ts = Math.round(new Date() / 1000);
    const carouselPath = path.join(__dirname, '../public/static/upload/banner/' + ts + '.png');
    const writeStream = fs.createWriteStream(carouselPath);
    try {
      await awaitWriteStream(fileBuffer.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(fileBuffer);
    }
    const imgPath = app.config.BaseUrl + app.config.uploadDir + '/banner/' + ts + '.png';
    return imgPath;
    // TODO carouselPath 是保存路径，入库
  }
  // 添加商品图片
  async addBannerImg(params, carouselPath) {
    const { ctx, app } = this;
    console.log(carouselPath);
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Banner.findOne({ id: params.id });
    if (!check) {
      return [ 404601, '该商品不存在或已经被软删除了' ];
    }
    await ctx.model.Banner.update({ id: params.id }, { image_url: carouselPath });
    return [ 0, '添加商品图成功', results[1], results[2] ];
  }
}
module.exports = GoodService;
