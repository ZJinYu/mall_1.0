'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const CardSchema = new Schema({
    id: { type: Number, allowNull: false }, // 会员卡id
    User: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户
    userId: { type: Number, allowNull: false },
    username: { type: String, allowNull: false },
    score: { type: Number, default: 0 }, // 会员卡积分
    status: { type: Number, default: 1 }, // 会员卡状态  0 停用 1 启用 2 挂失
    deleted: { type: Number, default: 1 }, // 是否已软删除  1否 0是
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });
  return mongoose.model('Card', CardSchema);
};
