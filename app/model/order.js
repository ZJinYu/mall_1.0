'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const OrderSchema = new Schema({
    id: { type: Number, allowNull: false }, // 订单id
    userId: { type: Number, allowNull: false }, // 用户id
    children: { type: Array, default: null }, // 订单商品信息
    status: { type: Number, default: 1 }, // 订单状态 3已收货 2已发货 1未发货
    type: { type: Number, default: 0 }, // 支付方式 1积分支付 0金额支付
    totalPrice: { type: Number, default: 0 }, // 订单总价
    username: { type: String, default: null }, // 订单用户名
    phone: { type: String, default: null }, // 联系方式
    address: { type: String, default: null }, // 详情地址
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });
  return mongoose.model('Order', OrderSchema);
};
