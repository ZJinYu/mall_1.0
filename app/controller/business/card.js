'use strict';
const Controller = require('egg').Controller;
class CardController extends Controller {
  // 查看个人会员卡信息
  async cardIndividual() {
    const { ctx } = this;
    const res = await ctx.service.card.cardIndividual(ctx.request.body);
    if (res) {
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 挂失会员卡
  async userLose() {
    const { ctx } = this;
    const res = await ctx.service.card.userLose(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 会员卡积分增加
  async scoreAdd() {
    const { ctx } = this;
    const res = await ctx.service.card.scoreAdd(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 会员卡积分支付
  async pay() {
    const { ctx } = this;
    const res = await ctx.service.card.pay(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = CardController;
