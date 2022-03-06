'use strict';

const Service = require('egg').Service;
const jwt = require('../utils/jwt');
class OrderService extends Service {
  // 创建订单
  async create(param) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] });
    for (const data of param.children) {
      const good = await ctx.model.Good.findOne({ id: data.goodId });
      if (good.quantity < data.count) { return [ -1, '勾选购物车中存在库存不足商品，请重新选择' ]; }
    }
    const order = await ctx.model.Order.aggregate().sort({ id: -1 });
    const newOrder = new ctx.model.Order({
      id: order.length === 0 ? 1 : order[0].id + 1,
      userId: user.id,
      children: param.children,
      totalPrice: param.totalPrice,
      type: param.type,
      username: user.realName,
      phone: user.phone,
      address: user.address,
      createTime: Math.round(new Date() / 1000),
    });
    for (const data of param.children) {
      const good = await ctx.model.Good.findOne({ id: data.goodId });
      const newQuantity = good.quantity - data.count;
      await ctx.model.Good.updateOne({ id: data.goodId }, { quantity: newQuantity });
    }
    newOrder.save();
    return [ 0, '创建订单成功', results[1], results[2] ];
  }
  // 所有订单的信息
  async list(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    console.log(results);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Order.find({}).ne('deleted', 0).countDocuments();
    if (!total) { return [ 404006, '暂无商品信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const orderResult = await this.ctx.model.Order.find({}).ne('deleted', 0).skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有订单信息返回成功', orderResult, totals, page, results[1], results[2] ];
  }
  // 查看个人订单信息
  async orderIndividual() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    if (!results[3]) { return [ -2, '非法用户' ]; }
    const orderResult = await ctx.model.Order.find({ userId: results[3] });
    return [ 0, '订单信息返回成功', orderResult, results[1], results[2] ];
  }
  // 订单发货
  async sendOut(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Order.findOne({ id: params.id, status: 1 });
    if (!check) { return [ -1, '订单已发货或不存在' ]; }
    await this.ctx.model.Order.updateOne({ id: params.id }, { status: 2, updateTime: Math.round(new Date() / 1000) });
    return [ 0, `该订单发货成功，执行人是${results[3]}`, results[1], results[2] ];
  }
  // 订单已收货
  async receiving(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Order.findOne({ id: params.id, status: 2 });
    console.log(check);
    if (!check) { return [ -1, '该订单未发货或不存在' ]; }
    await this.ctx.model.Order.updateOne({ id: params.id }, { status: 3, updateTime: Math.round(new Date() / 1000) });
    return [ 0, '订单收货成功', results[1], results[2] ];
  }
  // 模糊搜索订单
  async searchOrder(params, page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    let total = null;
    if (params.username === null) {
      total = await this.ctx.model.Order.find().ne('deleted', 0).countDocuments();
      if (!total) { return [ 404505, '暂无订单信息' ]; }
    } else {
      total = await this.ctx.model.Order.find({ username: { $regex: params.username } }).ne('deleted', 0).countDocuments();
      if (!total) { return [ 404505, '暂无订单信息' ]; }
    }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    let result = null;
    if (params.username === null) {
      result = await this.ctx.model.Order.find().ne('deleted', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
    } else {
      result = await this.ctx.model.Order.find({ username: { $regex: params.username } }).ne('deleted', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
    }
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '符合条件的所有订单信息返回成功', result, totals, page, results[1], results[2] ];
  }
}
module.exports = OrderService;
