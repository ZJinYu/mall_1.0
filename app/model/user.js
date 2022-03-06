'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    id: { type: Number, allowNull: false },
    nickName: { type: String, default: null }, // 昵称
    phone: { type: String, default: null }, // 联系方式
    email: { type: String, default: null }, // 邮箱
    password: { type: String, allowNull: false }, // 密码
    address: { type: String, default: null }, // 详细地址
    balance: { type: Number, default: 0 }, // 余额
    realName: { type: String, default: null }, // 真实姓名
    gender: { type: Number, default: 1 }, // 性别 1男 2女
    bornDate: { type: String, default: null }, // 出生日期
    age: { type: Number, default: null }, // 年龄
    status: { type: Boolean, default: true }, // 状态 true 正常 false 禁用
    type: { type: Number, default: 0 }, // 是否会员卡用户 0 非会员卡用户，1会员卡用户
    image_url: { type: String, default: null }, // 头像地址
    deleted: { type: Number, default: 1 }, // 是否已软删除  1否 0是
    createTime: { type: Number, default: null }, // 创建时间
    loginTime: { type: Number, default: null }, // 最后登录时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('User', UserSchema);
};
