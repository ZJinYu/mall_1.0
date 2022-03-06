'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const CartSchema = new Schema({
    id: { type: Number, allowNull: false }, // 购物车id
    userId: { type: Number, default: null },
    goodId: { type: Number, default: null },
    goodName: { type: String, default: null }, //  商品名
    price: { type: Number, default: null }, // 单价
    count: { type: Number, default: 1 }, // 数量
    image_url: { type: String, default: null }, // 图片地址
    deleted: { type: Number, default: 1 }, // 是否已软删除  1否 0是
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });
  return mongoose.model('Cart', CartSchema);
};
