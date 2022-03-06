'use strict';
// const fs = require('fs');
// const pump = require('pump');

const Controller = require('egg').Controller;
class GoodController extends Controller {

  // 商品创建
  async create() {
    const { ctx, service } = this;
    const file = ctx.request.files;
    // const dir = await service.good.saveGoodImg(file);
    const res = await ctx.service.good.create(ctx.request.body, file);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

  // 修改某个商品的信息
  async modifyGood() {
    const { ctx } = this;
    const res = await ctx.service.good.modifyGood(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], token: res[3], exp: res[4] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

  // 删除商品
  async deleteGood() {
    const { ctx } = this;
    const res = await ctx.service.good.deleteGood(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

  // 下架商品
  async disable() {
    const { ctx } = this;
    const res = await ctx.service.good.disable(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

  // 上架商品
  async recovery() {
    const { ctx } = this;
    const res = await ctx.service.good.recovery(ctx.request.body);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

  // 所有商品的信息
  async list() {
    const { ctx } = this;
    const res = await ctx.service.good.list(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  // 搜索商品
  async searchGood() {
    const { ctx } = this;
    const page = ctx.request.query.page || 1;
    const params = ctx.request.body;
    const res = await ctx.service.good.searchGood(params, page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
  async saveImg() {
    const { ctx, service } = this;
    console.log(ctx.request.files);
    const file = ctx.request.files[0];
    const param = ctx.request.body;
    const dir = await service.good.saveGoodImg(file);
    const res = await ctx.service.good.addGoodImg(param, dir);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = GoodController;
