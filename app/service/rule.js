'use strict';
const Service = require('egg').Service;
const jwt = require('../utils/jwt');
class GoodService extends Service {
  // 创建商品
  async create(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const rule = await ctx.model.Rule.aggregate().sort({ id: -1 });
    const newGood = new ctx.model.Rule({
      id: rule.length === 0 ? 1 : rule[0].id + 1,
      changeRules: params.changeRule,
      getRules: params.getRule,
      createTime: Math.round(new Date() / 1000),
    });
    newGood.save();
    return [ 0, '创建规则成功', results[1], results[2] ];
  }
  // 修改某个商品的信息
  async modifyRule(params) {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const updateRule = await ctx.model.Rule.findOne({ id: 1 });
    if (!updateRule) { return [ -1, '不存在此商品,请稍后重试' ]; }
    const checkParams = [ 'changeRule', 'getRule' ];
    const newData = new Map();
    const paramMap = new Map(Object.entries(params));
    const newRule = new Map(Object.entries(updateRule.toObject()));
    for (const k of paramMap.keys()) {
      if (params[k] !== newRule.get(k)) {
        if (!checkParams.includes(k)) { continue; }
        if (!params[k]) { continue; }
        newData.set(k, params[k]);
      }
    }
    if (!newData.size) { return [ -1, '没进行任何修改' ]; }
    const obj = Object.create(null);
    for (const [ k, v ] of newData) {
      obj[k] = v;
    }
    obj.updateTime = Math.round(new Date() / 1000);
    await this.ctx.model.Rule.updateOne({ id: 1 }, obj);
    return [ 0, '规则信息修改成功', results[1], results[2] ];
  }
  // 所有规则的信息
  async ruleInfo() {
    const { ctx, app } = this;
    const results = jwt(app, ctx.request.header.authorization);
    if (results[0]) { return [ -3, '请求失败' ]; }
    const { pageSize } = this.config.paginatorConfig;
    const ruleResult = await this.ctx.model.Rule.find({})
      .limit(pageSize);
    return [ 0, '获取规则信息成功', ruleResult ];
  }
}
module.exports = GoodService;
