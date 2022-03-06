'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const CategorySchema = new Schema({
    id: { type: Number, allowNull: false }, // 分类id
    parentId: { type: Number, default: 0 }, // 父级id
    name: { type: String, allowNull: false }, // 名字
    deleted: { type: Number, default: 1 }, // 是否已软删除 0是 1否
    createTime: { type: Number, default: null }, // 创建时间
    updateTime: { type: Number, default: null }, // 更新时间
  });

  return mongoose.model('Category', CategorySchema);
};
