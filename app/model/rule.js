'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RuleSchema = new Schema({
    id: { type: Number, allowNull: false }, // id
    changeRule: { type: Number, default: 1 }, // 兑换规则
    getRule: { type: Number, default: 1 }, // 获得规则
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('Rule', RuleSchema);
};
