/**
 * @author: Chenyt
 * @date: 2020/12/11 11:00 AM
 * @CompletionDate：2020/03/02 4:50AM
 */
'use strict';
const Controller = require('egg').Controller;
class RuleController extends Controller {

  // 规则创建
  async create() {
    const {ctx} = this;
    const res = await ctx.service.rule.create(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = {code: res[0], msg: res[1], token: res[2], exp: res[3]};
    } else {
      ctx.body = {code: res[0], msg: res[1]};
    }
  }
  // 获取规则
  async ruleInfo() {
    const { ctx } = this;
    const res = await ctx.service.rule.ruleInfo(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 修改规则
  async modifyRule() {
    const { ctx } = this;
    const res = await ctx.service.rule.modifyRule(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1]};
    }
  }
}
module.exports = RuleController;
