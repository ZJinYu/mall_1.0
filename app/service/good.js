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
  // 创建商品
  async create(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const good = await ctx.model.Good.aggregate().sort({ id: -1 });
    const newGood = new ctx.model.Good({
      id: good.length === 0 ? 1 : good[0].id + 1,
      goodName: params.goodName,
      weight: params.weight,
      smallTitle: params.smallTitle,
      buildDate: params.buildDate,
      supplier: params.supplier,
      price: params.price,
      quantity: params.quantity,
      status: params.status,
      class: params.class,
      type: params.type,
      delivery: params.type,
      detail: params.detail,
      // detailImage_url: carouselPath,
      createTime: Math.round(new Date() / 1000),
    });
    newGood.save();
    return [ 0, '创建商品成功', results[1], results[2] ];
  }
  // 修改某个商品的信息
  async modifyGood(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const updateGood = await ctx.model.Good.findOne({ id: params.id }).ne('deleted', 0);
    if (!updateGood) { return [ -1, '不存在此商品,请稍后重试' ]; }
    const checkParams = [ 'goodName', 'buildDate', 'supplier', 'price', 'quantity', 'type', 'class', 'weight', 'delivery', 'smallTitle', 'detail' ];
    const newData = new Map();
    const paramMap = new Map(Object.entries(params));
    const newGood = new Map(Object.entries(updateGood.toObject()));
    for (const k of paramMap.keys()) {
      if (params[k] !== newGood.get(k)) {
        if (!checkParams.includes(k)) { continue; }
        if (!params[k]) { continue; }
        newData.set(k, params[k]);
      }
    }
    if (!newData.size) { return [ -1, '没进行任何修改' ]; }
    const obj = Object.create(null);
    for (const [ k, v ] of newData) {
      obj[k] = v;
    }
    obj.updateTime = Math.round(new Date() / 1000);
    await this.ctx.model.Good.updateOne({ id: params.id }, obj);
    return [ 0, '商品信息修改成功', results[1], results[2] ];
  }
  // 所有商品的信息
  async list(page) {
    const { ctx, app } = this;
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Good.find({}).ne('deleted', 0).countDocuments();
    if (!total) { return [ 404006, '暂无商品信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const goodResult = await this.ctx.model.Good.find({}).ne('deleted', 0).skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有商品信息返回成功', goodResult, totals, page ];
  }
  // 根据Id获得商品详情
  async goodDetail(param) {
    const { ctx } = this;
    const goodDetail = await ctx.model.Good.findOne({ id: param.id }).ne('status', false).ne('deleted', 0);
    if (!goodDetail) { return [ 400402, '暂无商品详情信息' ]; }
    return [ 0, '所有商品信息返回成功', goodDetail ];
  }
  // 删除商品
  async deleteGood(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Good.findOne({ id: params.id }).ne('deleted', 0);
    if (!check) { return [ -1, '该商品不存在或已经被软删除了' ]; }
    await this.ctx.model.Good.updateOne({ id: check.id }, { deleted: 0 });
    return [ 0, `该商品软删除成功了，执行人是${results[3]}`, results[1], results[2] ];
  }
  // 下架商品
  async disable(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Good.findOne({ id: params.id, status: 0 }).ne('deleted', 0);
    if (check) { return [ -1, '该商品已经下架了' ]; }
    await this.ctx.model.Good.updateOne({ id: params.id }, { status: 0 });
    return [ 0, `该商品下架成功，执行人是${results[3]}`, results[1], results[2] ];
  }
  // 上架商品
  async recovery(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Good.findOne({ id: params.id, status: 1 }).ne('deleted', 0);
    if (check) { return [ -1, '该商品已经上架了' ]; }
    await this.ctx.model.Good.updateOne({ id: params.id }, { status: 1 });
    return [ 0, `该商品上架成功，执行人是${results[3]}`, results[1], results[2] ];
  }
  // 模糊搜索商品
  async searchGood(params, page) {
    const { ctx, app } = this;
    const { pageSize } = this.config.paginatorConfig;
    let total = null;
    if (params.goodName === null) {
      total = await this.ctx.model.Good.find().ne('deleted', 0).countDocuments();
      if (!total) { return [ 404505, '暂无商品信息' ]; }
    } else {
      total = await this.ctx.model.Good.find({ goodName: { $regex: params.goodName } }).ne('deleted', 0).countDocuments();
      if (!total) { return [ 404505, '暂无商品信息' ]; }
    }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    let result = null;
    if (params.goodName === null) {
      result = await this.ctx.model.Good.find().ne('deleted', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
    } else {
      result = await this.ctx.model.Good.find({ goodName: { $regex: params.goodName } }).ne('deleted', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
    }
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '符合条件的所有商品信息返回成功', result, totals, page ];
  }
  // 保存商品图片
  async saveGoodImg(filename) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const fileBuffer = fs.createReadStream(filename.filepath);
    const ts = Math.round(new Date() / 1000);
    const carouselPath = path.join(__dirname, '../public/static/upload/good/' + ts + '.png');
    const writeStream = fs.createWriteStream(carouselPath);
    console.log('c', carouselPath);
    try {
      await awaitWriteStream(fileBuffer.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(fileBuffer);
    }
    const imgPath = app.config.BaseUrl + app.config.uploadDir + '/good/' + ts + '.png';
    return imgPath;
    // TODO carouselPath 是保存路径，入库
  }
  //
  // async saveDetailImg(filename){
  //   const { ctx, app } =this;
  //   const results = jwt(app, ctx.request.header.authorization);
  //   if (results[0]) { return [ -3, '请求失败' ]; }
  //   const arr = [];
  //   for (const i of filename) {
  //     const fileBuffer = fs.createReadStream(i.filepath);
  //     const ts = Math.round(new Date() / 1000);
  //     const carouselPath = path.join(__dirname, '../public/static/upload/details/' + ts + '.png');
  //     const writeStream = fs.createWriteStream(carouselPath);
  //     console.log('c', carouselPath);
  //     try {
  //       await awaitWriteStream(fileBuffer.pipe(writeStream));
  //     } catch (err) {
  //       await sendToWormhole(fileBuffer);
  //     }
  //     const imgPath = app.config.BaseUrl + app.config.uploadDir + '/good/' + ts + '.png';
  //     arr.push(imgPath);
  //   }
  //   return arr;
  //   // TODO carouselPath 是保存路径，入库
  // }
  // 添加商品图片
  async addGoodImg(params, carouselPath) {
    const { ctx, app } = this;
    console.log(carouselPath);
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Good.findOne({ id: params.id });
    if (!check) {
      return [ 404601, '该商品不存在或已经被软删除了' ];
    }
    await ctx.model.Good.update({ id: params.id }, { image_url: carouselPath });
    return [ 0, '添加商品图成功', results[1], results[2] ];
  }
}
module.exports = GoodService;
