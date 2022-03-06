'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 所有用户信息
  async list() {
    const { ctx } = this;
    const res = await ctx.service.user.list(ctx.request.query.page);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 创建新用户
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
  // 修改某个用户的个人信息
  async modifyUser() {
    const { ctx } = this;
    const res = await ctx.service.user.modifyUser(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 禁用用户
  async disable() {
    const { ctx } = this;
    const res = await ctx.service.user.disable(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 恢复用户
  async recovery() {
    const { ctx } = this;
    const res = await ctx.service.user.recovery(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 搜索用户
  async searchUser() {
    const { ctx } = this;
    const page = ctx.request.query.page || 1;
    const params = ctx.request.body;
    const res = await ctx.service.user.searchUser(params, page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = UserController;
