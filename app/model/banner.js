'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const BannerSchema = new Schema({
    id: { type: Number, allowNull: false }, // bannerId
    image_url: { type: String, default: null }, // 图片地址
    deleted: { type: Number, default: 1 }, // 是否已软删除  1否 0是
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });
  return mongoose.model('Banner', BannerSchema);
};
