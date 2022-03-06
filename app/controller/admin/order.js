'use strict';
const Controller = require('egg').Controller;
class OrderController extends Controller {
  // 修改某个订单信息
  async modifyOrder() {
    const { ctx } = this;
    const res = await ctx.service.order.modifyOrder(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

  // 删除订单
  async deleteOrder() {
    const { ctx } = this;
    const res = await ctx.service.order.deleteOrder(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 订单发货
  async sendOut() {
    const { ctx } = this;
    const res = await ctx.service.order.sendOut(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 所有订单的信息
  async list() {
    const { ctx } = this;
    const res = await ctx.service.order.list(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6]};
    } else {
      ctx.body = { code: res[0], msg: res[1]};
    }
  }
  // 搜索订单
  async searchOrder() {
    const { ctx } = this;
    const page = ctx.request.query.page || 1;
    const params = ctx.request.body;
    const res = await ctx.service.order.searchOrder(params, page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = OrderController;
