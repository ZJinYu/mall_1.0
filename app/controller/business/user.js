'use strict';
const fs = require('fs');
const pump = require('pump');

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 创建用户
  async create() {
    const { ctx } = this;
    const res = await ctx.service.user.create(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 用户登录
  async login() {
    const { ctx } = this;
    const res = await ctx.service.user.login(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 用户个人信息
  async information() {
    const { ctx } = this;
    const res = await ctx.service.user.information(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 修改用户个人信息
  async modify() {
    const { ctx } = this;
    const res = await ctx.service.user.modify(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 充值
  async balanceAdd() {
    const { ctx } = this;
    const res = await ctx.service.user.balanceAdd(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  async monetary() {
    const { ctx } = this;
    const res = await ctx.service.user.monetary(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

}
module.exports = UserController;
