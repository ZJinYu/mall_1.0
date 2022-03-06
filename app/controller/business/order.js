'use strict';
const Controller = require('egg').Controller;
class OrderController extends Controller {
  // 订单创建
  async create() {
    const { ctx } = this;
    const res = await ctx.service.order.create(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3]};
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 个人订单信息
  async orderIndividual() {
    const { ctx } = this;
    const res = await ctx.service.order.orderIndividual(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 订单收货
  async receiving() {
    const { ctx } = this;
    const res = await ctx.service.order.receiving(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = OrderController;
