'use strict';
const Controller = require('egg').Controller;
class GoodController extends Controller {
  // 所有商品的信息
  async list() {
    const { ctx } = this;
    const res = await ctx.service.good.list(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6]};
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  async goodDetail() {
    const { ctx } = this;
    const res = await ctx.service.good.goodDetail(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 搜索商品
  async searchGood() {
    const { ctx } = this;
    const page = ctx.request.query.page || 1;
    const params = ctx.request.body;
    const res = await ctx.service.good.searchGood(params, page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = GoodController;
