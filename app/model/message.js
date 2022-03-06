'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const MessageSchema = new Schema({
    id: { type: Number, allowNull: false }, // 留言id
    User: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户
    message: { type: String, default: null }, // 留言
    deleted: { type: Number, default: 1 }, // 是否已软删除  1否 0是
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });
  return mongoose.model('Message', MessageSchema);
};
