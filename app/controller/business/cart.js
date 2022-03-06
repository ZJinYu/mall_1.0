'use strict';
const Controller = require('egg').Controller;
class CartController extends Controller {
  // 商品加入购物车
  async create() {
    const { ctx } = this;
    const res = await ctx.service.cart.create(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3]};
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 修改购物车中的商品
  async modifyCart() {
    const { ctx } = this;
    const res = await ctx.service.cart.modifyCart(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1]};
    }
  }

  // 删除购物车中的商品
  async deleteCart() {
    const { ctx } = this;
    const res = await ctx.service.cart.deleteCart(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 查看个人购物车信息
  async cartIndividual() {
    const { ctx } = this;
    const res = await ctx.service.cart.cartIndividual(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = CartController;
