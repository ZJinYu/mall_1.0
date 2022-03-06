'use strict';
const Controller = require('egg').Controller;
class CategoryController extends Controller {
  // 创建类别类
  async create() {
    const { ctx } = this;
    const res = await ctx.service.category.create(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 删除科目类
  async del() {
    const { ctx } = this;
    const res = await ctx.service.category.del(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 查看所有科目
  async list() {
    const { ctx } = this;
    const res = await ctx.service.category.list(ctx.request.query.page);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 查看所有科目
  async listOfAdmin() {
    const { ctx } = this;
    const res = await ctx.service.category.listOfAdmin(ctx.request.query);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
    ctx.status = 201;
  }
  // 搜索类别
  async searchCategory() {
    const { ctx } = this;
    const page = ctx.request.query.page || 1;
    const params = ctx.request.body;
    const res = await ctx.service.category.searchCategory(params, page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = CategoryController;
