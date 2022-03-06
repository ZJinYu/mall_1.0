'use strict';
const Controller = require('egg').Controller;
class RuleController extends Controller {

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


}
module.exports = RuleController;
