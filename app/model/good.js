'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const GoodSchema = new Schema({
    id: { type: Number, allowNull: false }, // 商品id
    goodName: { type: String, default: null }, // 商品名
    smallTitle: { type: String, default: null },
    buildDate: { type: String, default: 0 }, // 生产日期
    image_url: { type: String, default: null }, // 图片地址
    supplier: { type: String, default: null }, // 供货商
    weight: { type: Number, default: null },
    price: { type: Number, default: 0 }, // 单价
    quantity: { type: Number, default: 0 }, // 数量
    class: { type: String, default: null }, // 父类
    status: { type: Boolean, default: true }, // 上架状态 false下架 true上架
    type: { type: String, default: null }, // 类别
    delivery: { type: String, default: null }, // 配送范围
    detail: { type: String, default: null }, // 详情图片
    deleted: { type: Number, default: 1 }, // 是否已软删除  1否 0是
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });
  return mongoose.model('Good', GoodSchema);
};
