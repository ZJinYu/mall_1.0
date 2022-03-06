'use strict';

const Service = require('egg').Service;
const jwt = require('../utils/jwt');
class CartService extends Service {
  // 购物车添加商品
  async create(param) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] });
    if (!user) { return [ -1, '当前用户无效' ]; }
    const good = await ctx.model.Good.findOne({ id: param.id})
    if (good.quantity < 1) { return [ -1, '当前商品暂时缺货' ]; }
    const addGood = await ctx.model.Cart.findOne({ goodId: param.id, userId: results[3] }).ne('deleted', 0);
    if (addGood) {
      await ctx.model.Cart.updateOne({ goodId: param.id,userId: results[3] }, { count: addGood.count + param.count });
      return [ 0, '购物车中已存在该商品，增加了购物车中该商品的数量', results[1], results[2] ];
    }
    const newCart = new ctx.model.Cart({
      id: Math.round(new Date() / 1000 + Math.ceil(Math.random() * 10000)),
      goodId: param.id,
      goodName: param.goodName,
      price: param.price,
      count: param.count,
      image_url: param.image_url,
      createTime: Math.round(new Date() / 1000),
      userId: user.id,
    });
    newCart.save();
    return [ 0, '加入购物车成功', results[1], results[2] ];
  }
  // 修改购物车信息
  async modifyCart(param) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const updateCart = await ctx.model.Cart.findOne({ id: param.id, deleted: 1 });
    if (!updateCart) { return [ -1, '不存在此商品,请稍后重试' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] });
    if (!user) { return [ -1, '查无此用户' ]; }
    param.User = user;
    const checkParams = [ 'count' ];
    const newData = new Map();
    const paramMap = new Map(Object.entries(param));
    const newCart = new Map(Object.entries(updateCart.toObject()));
    for (const k of paramMap.keys()) {
      if (param[k] !== newCart.get(k)) {
        if (!checkParams.includes(k)) { continue; }
        if (!param[k]) { continue; }
        newData.set(k, param[k]);
      }
    }
    if (!newData.size) { return [ -1, '没进行任何修改' ]; }
    const obj = Object.create(null);
    for (const [ k, v ] of newData) {
      obj[k] = v;
    }
    obj.updateTime = Math.round(new Date() / 1000);
    await this.ctx.model.Cart.updateOne({ id: param.id }, obj);
    return [ 0, '购物车信息修改成功', results[1], results[2] ];
  }
  // 删除购物车
  async deleteCart(param) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Cart.findOne({ id: param.id }).ne('deleted', 0);
    if (!check) { return [ -1, '该商品不存在或已经被软删除了' ]; }
    await this.ctx.model.Cart.updateOne({ id: check.id }, { deleted: 0 });
    return [ 0, `该商品软删除成功，执行人是${results[3]}`, results[1], results[2] ];
  }
  // 查看个人购物车信息
  async cartIndividual() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    if (!results[3]) { return [ -2, '非法用户' ]; }
    const cartResult = await ctx.model.Cart.find({ userId: results[3] }).ne('deleted', 0);
    if (!cartResult) { return [ 0, '当前购物车为空', cartResult, results[1], results[2] ]; }
    return [ 0, '当前购物车信息返回成功', cartResult, results[1], results[2] ];
  }
}
module.exports = CartService;
