'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const AdminSchema = new Schema({
    id: { type: Number, allowNull: false }, // 管理员id
    username: { type: String, allowNull: false }, // 管理员登陆名
    realName: { type: String, default: null }, // 管理员真实姓名
    password: { type: String, allowNull: false }, // 管理员登陆密码
    gender: { type: Number, default: 1 }, // 性别 1男 2女
    phone: { type: Number, default: null },
    role: { type: String, default: null },
    status: { type: Boolean, default: true }, // 管理员状态 true 正常 false 禁用
    deleted: { type: Number, default: 1 }, // 是否已软删除  1否 0是
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
    loginTime: { type: Number, default: null }, // 登录时间
  });

  return mongoose.model('Admin', AdminSchema);
};
