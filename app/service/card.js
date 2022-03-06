'use strict';

const Service = require('egg').Service;
const jwt = require('../utils/jwt');
class CardService extends Service {
  // 会员卡创建
  async create(param) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: param.id });
    if (!user) { return [ -1, '查无此用户' ]; }
    const checkCard = await ctx.model.Card.findOne({ username: param.username }).ne('deleted', 0);
    if (checkCard) { return [ 404002, '用户已经创建了会员卡' ]; }
    const newCard = new ctx.model.Card({
      id: Math.round(new Date() / 1000 + Math.ceil(Math.random() * 10000)),
      username: param.username,
      userId: param.id,
      createTime: Math.round(new Date() / 1000),
      User: user,
    });
    newCard.save();
    return [ 0, '会员卡创建成功', results[1], results[2] ];
  }
  // 修改会员卡信息
  async modifyCard(param) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const updateCard = await ctx.model.Card.findOne({ id: param.id, deleted: 1 });
    if (!updateCard) { return [ -1, '不存在此会员卡,请稍后重试' ]; }
    const user = await ctx.model.User.findOne({ id: param.id });
    if (!user) { return [ -1, '查无此用户' ]; }
    param.User = user;
    const checkParams = [ 'User', 'score', 'status' ];
    const newData = new Map();
    const paramMap = new Map(Object.entries(param));
    const newCard = new Map(Object.entries(updateCard.toObject()));
    for (const k of paramMap.keys()) {
      if (param[k] !== newCard.get(k)) {
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
    await this.ctx.model.Card.updateOne({ id: param.id }, obj);
    return [ 0, '会员卡信息修改成功', results[1], results[2] ];
  }
  // 删除会员卡
  async deleteCard(param) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Card.findOne({ id: param.id }).ne('deleted', 0);
    if (!check) { return [ -1, '该会员卡不存在或已经被软删除了' ]; }
    await this.ctx.model.Card.updateOne({ id: check.id }, { deleted: 0 });
    return [ 0, `该会员卡软删除成功，执行人是${results[3]}`, results[1], results[2] ];
  }
  // 禁用会员卡
  async disable(param) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Card.findOne({ id: param.id, status: 1 }).ne('deleted', 0);
    if (!check) { return [ -1, '该会员卡不存在或已挂失了' ]; }
    await this.ctx.model.Card.updateOne({ id: check.id }, { status: 0 });
    return [ 0, `该会员卡禁用成功，执行人是${results[3]}`, results[1], results[2] ];
  }
  // 恢复会员卡
  async recovery(param) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Card.findOne({ id: param.id, status: 0 }).ne('deleted', 0);
    if (!check) { return [ -1, '该会员卡不存在' ]; }
    await this.ctx.model.Card.updateOne({ id: check.id }, { status: 1 });
    return [ 0, `该会员卡恢复成功，执行人是${results[3]}`, results[1], results[2] ];
  }

  // 会员卡挂失
  async lose(param) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Card.findOne({ id: param.id, status: 1 }).ne('deleted', 0);
    if (!check) { return [ -1, '该会员卡已被禁用或不存在' ]; }
    await this.ctx.model.Card.updateOne({ id: check.id }, { status: 2 });
    return [ 0, `该会员卡已挂失，执行人是${results[3]}`, results[1], results[2] ];
  }
  // 所有会员卡的信息
  async list(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.Card.find({}).countDocuments();
    if (!total) { return [ -1, '暂无会员卡信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const cardResult = await this.ctx.model.Card.find({}).ne('deleted', 0).skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '所有会员卡信息返回成功', cardResult, totals, page, results[1], results[2] ];

  }
  // 查看个人会员卡信息
  async cardIndividual() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    if (!results[3]) { return [ -2, '非法用户' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }, { id: 0, password: 0 }).ne('status', 0);
    const cardResult = await ctx.model.Card.findOne({ User: user });
    return [ 0, '会员卡信息返回成功', cardResult, results[1], results[2] ];
  }
  // 会员挂失会员卡
  async userLose() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const check = await ctx.model.Card.findOne({ userId: results[3], status: 1 }).ne('deleted', 0);
    if (!check) { return [ -1, '该会员卡已被禁用或不存在' ]; }
    await this.ctx.model.Card.updateOne({ id: check.id }, { status: 2 });
    console.log(check);
    return [ 0, `${check.username}会员,您的会员卡已成功挂失`, results[1], results[2] ];
  }
  // 会员卡积分增加
  async scoreAdd(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const result = await ctx.model.Card.findOne({ userId: results[3] }).ne('status', 0);
    if (!result) { return [ 400704, '您暂未办理会员卡或会员卡已挂失停用' ]; }
    if (params.score) {
      result.score = Number(result.score) + Number(params.score);
      result.save();
      return [ 0, `积分增加${params.score}`, results[1], results[2] ];
    }
  }
  // 会员卡积分消费
  async pay(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    const result = await ctx.model.Card.findOne({ userId: results[3] }).ne('status', 0).ne('status', 2);
    if (!result) { return [ 400704, '会员卡不存在或已挂失' ]; }
    if (!params.totalScore) { return [ 400704, '兑换请求失败请重试' ]; }
    if (result.score < params.totalScore) { return [ 400704, '积分不足，无法兑换' ]; }
    result.score -= params.totalScore;
    result.save();
    await this.ctx.model.Card.updateOne({ id: params.id }, { updateTime: Math.round(new Date() / 1000) });
    return [ 0, '积分兑换成功', results[1], results[2] ];
  }
  // 模糊搜索会员卡
  async searchCard(params, page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    let total = null;
    if (params.username === null) {
      total = await this.ctx.model.Card.find().ne('deleted', 0).countDocuments();
      if (!total) { return [ 404505, '暂无会员卡信息' ]; }
    } else {
      total = await this.ctx.model.Card.find({ username: { $regex: params.username } }).ne('deleted', 0).countDocuments();
      if (!total) { return [ 404505, '暂无会员卡信息' ]; }
    }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    let result = null;
    if (params.username === null) {
      result = await this.ctx.model.Card.find().ne('deleted', 0).skip((page - 1) * pageSize).limit(pageSize);
    } else {
      result = await this.ctx.model.Card.find({ username: { $regex: params.username } }).ne('deleted', 0).skip((page - 1) * pageSize).limit(pageSize);
    }
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '符合条件的所有会员卡信息返回成功', result, totals, page, results[1], results[2] ];
  }
}
module.exports = CardService;
