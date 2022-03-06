'use strict';
const Controller = require('egg').Controller;
class CardController extends Controller {
  // 会员卡创建
  async create() {
    const { ctx } = this;
    const res = await ctx.service.card.create(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3]};
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

  // 修改会员卡信息
  async modifyCard() {
    const { ctx } = this;
    const res = await ctx.service.card.modifyCard(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1]};
    }
  }

  // 删除会员卡
  async deleteCard() {
    const { ctx } = this;
    const res = await ctx.service.card.deleteCard(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

  // 禁用会员卡
  async disable() {
    const { ctx } = this;
    const res = await ctx.service.card.disable(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

  // 恢复会员卡
  async recovery() {
    const { ctx } = this;
    const res = await ctx.service.card.recovery(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

  // 会员卡挂失
  async lose() {
    const { ctx } = this;
    const res = await ctx.service.card.lose(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 所有会员卡的信息
  async list() {
    const { ctx } = this;
    const res = await ctx.service.card.list(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6]};
    } else {
      ctx.body = { code: res[0], msg: res[1]};
    }
  }
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
  // 搜索会员卡
  async searchCard() {
    const { ctx } = this;
    const page = ctx.request.query.page || 1;
    const params = ctx.request.body;
    const res = await ctx.service.card.searchCard(params, page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = CardController;
