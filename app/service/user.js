'use strict';

const Service = require('egg').Service;
const md5 = require('js-md5');
const jwt = require('../utils/jwt');
// const path = require('path');
// const sd = require('silly-datetime');
// const mkdirp = require('mkdirp');

class UserService extends Service {
  // 创建用户
  async create(params) {
    const { ctx } = this;
    let checkUser = null;
    if (!params.email) {
      checkUser = await ctx.model.User.findOne({ phone: params.phone });
    } else {
      checkUser = await ctx.model.User.findOne({ $or: [{ phone: params.phone }, { email: params.email }] });
    }
    if (checkUser) { return [ 400400, '你已经用手机或邮箱创建过了，请前往登录亲' ]; }
    const user = await ctx.model.User.aggregate().sort({ id: -1 });
    const newUser = new ctx.model.User({
      createTime: Math.round(new Date() / 1000),
      phone: params.phone,
      email: params.email,
      age: params.age,
      realName: params.realName,
      bornDate: params.bornDate,
      password: md5(params.password),
      gender: params.gender,
      address: params.address,
    });
    newUser.nickName = params.nickName;
    if (!params.nickName) {
      const round = Math.round(new Date() / 1000);
      newUser.nickName = '用户' + round;
    }
    if (!user.length) {
      newUser.id = new Date().getFullYear().toString()
        .substr(0, 4) + '01';
      newUser.save();
      return [ 0, '用户创建成功，你可以进行登录了' ];
    }
    newUser.id = user[0].id + 1;
    newUser.save();
    return [ 0, '用户创建成功，你可以进行登录了' ];
  }
  // 用户登录
  async login(params) {
    const { ctx, app } = this;
    const user = await ctx.model.User.findOne({ $or: [{ phone: params.username }, { email: params.username }] });
    if (!user) { return [ 400401, '您尚未注册，请前往注册' ]; }
    if (user.status === false) { return [ 400401, '您的账号已被禁用，请联系管理员' ]; }
    const pwd = md5(params.password);
    if (pwd !== user.password) { return [ 404401, '登录失败，密码错误' ]; }
    const exp = Math.round(new Date() / 1000) + (60 * 60 * 3);
    const token = app.jwt.sign({
      name: user.id,
      iat: Math.round(new Date() / 1000),
      exp,
    }, app.config.jwt.secret);
    user.loginTime = Math.round(new Date() / 1000);
    user.save();
    return [ 0, `${user.nickName} 登录成功，欢迎回来`, token, exp ];
  }
  // 用户个人信息
  async information() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    if (!results[3]) { return [ -2, '非法用户' ]; }
    const userInfo = await ctx.model.User.findOne({ id: results[3] }, { id: 0, password: 0 }).ne('status', 0);
    if (!userInfo) { return [ 400402, '暂无用户个人信息' ]; }
    return [ 0, `${userInfo.nickName}的个人信息返回成功`, userInfo, results[1], results[2] ];
  }
  // 管理员查看用户所有信息
  async list(page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const total = await this.ctx.model.User.find({}).countDocuments();
    if (!total) { return [ 404201, '暂无用户信息' ]; }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    const userResult = await this.ctx.model.User.find({}, { _id: 0, password: 0 }).skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    console.log(userResult);
    return [ 0, '所有用户信息返回成功', userResult, totals, page, results[1], results[2] ];
  }
  // 修改用户个人信息
  async modify(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    if (params.oldPassword) {
      const oldPwd = md5(params.oldPassword);
      if (oldPwd !== user.password) { return [ 400403, '旧密码输入错误，请重新输入' ]; }
      params.password = md5(params.newPassword);
      if (oldPwd === params.password) { return [ 400403, '新密码不得和旧密码一模一样，请重新输入' ]; }
    }
    if (params.email) {
      const check = await ctx.model.User.findOne({ email: params.email });
      if (!check) { return [ 400403, '此邮箱已经被注册过，不能重复' ]; }
    }
    const checkParams = [ 'nickName', 'email', 'realName', 'age', 'gender', 'address', 'password' ];
    const newData = new Map();
    const paramsMap = new Map(Object.entries(params));
    const newUser = new Map(Object.entries(user.toObject()));
    for (const k of paramsMap.keys()) {
      if (params[k] !== newUser.get(k)) {
        if (!checkParams.includes(k)) { continue; }
        if (!params[k]) { continue; }
        newData.set(k, params[k]);
      }
    }
    if (!newData.size) { return [ 400403, '没有进行任何修改' ]; }
    const obj = Object.create(null);
    for (const [ k, v ] of newData) {
      obj[k] = v;
    }
    obj.updateTime = Math.round(new Date() / 1000);
    await this.ctx.model.User.updateOne({ id: results[3] }, obj);
    ctx.status = 201;
    return [ 0, '用户个人信息修改成功', results[1], results[2] ];
  }
  // 修改某个用户的个人信息
  async modifyUser(params) {
    const { ctx, app } = this;
    console.log(params);
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const updateUser = await ctx.model.User.findOne({ id: params.id, deleted: 1 });
    console.log(updateUser);
    if (!updateUser) { return [ 404005, '不存在此用户，请稍后重试' ]; }
    if (params.password) { params.password = md5(params.password); }
    const checkParams = [ 'nickName', 'gender', 'email', 'phone', 'address', 'age' ];
    const newData = new Map();
    const paramMap = new Map(Object.entries(params));
    const newUser = new Map(Object.entries(updateUser.toObject()));
    for (const k of paramMap.keys()) {
      if (params[k] !== newUser.get(k)) {
        if (!checkParams.includes(k)) { continue; }
        if (!params[k]) { continue; }
        newData.set(k, params[k]);
      }
    }
    if (!newData.size) { return [ 404005, `${results[3]}没进行任何修改` ]; }
    const obj = Object.create(null);
    for (const [ k, v ] of newData) {
      obj[k] = v;
    }
    obj.updateTime = Math.round(new Date() / 1000);
    await this.ctx.model.User.updateOne({ id: params.id }, obj);
    return [ 0, `${updateUser.nickname}信息修改成功`, results[1], results[2] ];
  }
  // 增加余额
  async balanceAdd(param) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '非法用户' ]; }
    if (param.balance) {
      user.balance = Number(user.balance) + Number(param.balance);
      user.save();
      return [ 0, `余额增加${param.balance}元`, results[1], results[2] ];
    }
    return [ 400405, '增加失败，请增加固定金额' ];
  }
  // 余额消费
  async monetary(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -1, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: results[3] }).ne('status', 0);
    if (!user) { return [ -2, '不存在用户' ]; }
    if (!params.totalPrice) { return [ 400704, '交易失败请重试' ]; }
    if (user.balance < params.totalPrice) { return [ 400704, '余额不足，请充值后重试' ]; }
    user.balance -= params.totalPrice;
    user.save();
    await this.ctx.model.User.updateOne({ id: params.id }, { state: 2, updateTime: Math.round(new Date() / 1000) });
    return [ 0, '支付成功', results[1], results[2] ];
  }
  // 禁用用户
  async disable(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: params.id }).ne('deleted', 0);
    if (!user) { return [ 404008, '该用户不存在' ]; }
    const check = await ctx.model.User.findOne({ id: params.id, status: 0 });
    if (check) { return [ 404008, '该用户已经禁用' ]; }
    await this.ctx.model.User.updateOne({ id: user.id }, { status: 0 });
    return [ 0, `${user.nickName}禁用成功，执行人是${results[3]}`, results[1], results[2] ];
  }
  // 恢复用户
  async recovery(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const user = await ctx.model.User.findOne({ id: params.id }).ne('deleted', 0);
    if (!user) { return [ 404008, '该用户不存在' ]; }
    const check = await ctx.model.User.findOne({ id: params.id, status: 1 });
    if (check) { return [ 404008, '该用户已经恢复状态了' ]; }
    await this.ctx.model.User.updateOne({ id: user.id }, { status: 1 });
    return [ 0, `${user.nickName}恢复成功，执行人是${results[3]}`, results[1], results[2] ];
  }
  // 模糊搜索会员卡
  async searchUser(params, page) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    let total = null;
    if (params.realName === null) {
      total = await this.ctx.model.User.find().ne('deleted', 0).countDocuments();
      if (!total) { return [ 404505, '暂无用户信息' ]; }
    } else {
      total = await this.ctx.model.User.find({ realName: { $regex: params.realName } }).ne('deleted', 0).countDocuments();
      if (!total) { return [ 404505, '暂无用户信息' ]; }
    }
    const totals = Math.ceil(total / pageSize);
    if (page > totals) { return [ -2, '无效页码' ]; }
    if (page < 1) { page = 1; }
    let result = null;
    if (params.realName === null) {
      result = await this.ctx.model.User.find().ne('deleted', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
    } else {
      result = await this.ctx.model.User.find({ realName: { $regex: params.realName } }).ne('deleted', 0).skip((page - 1) * pageSize)
        .limit(pageSize);
    }
    if (!Number(page)) {
      page = 1;
    } else {
      page = Number(page);
    }
    return [ 0, '符合条件的所有用户信息返回成功', result, totals, page, results[1], results[2] ];
  }


}
module.exports = UserService;
