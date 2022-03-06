'use strict';
// const fs = require('fs');
// const pump = require('pump');

const Controller = require('egg').Controller;
class BannerController extends Controller {

  // 轮播图创建
  async create() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    const dir = await ctx.service.banner.saveBannerImg(file);
    const res = await ctx.service.banner.create(dir);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

  // 删除banner
  async deleteBanner() {
    const { ctx } = this;
    const res = await ctx.service.banner.deleteBanner(ctx.request.body);
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
    const res = await ctx.service.banner.list(ctx.request.query.page);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], data: res[2], totals: res[3], page: res[4], token: res[5], exp: res[6] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }

  async saveImg() {
    const { ctx, service } = this;
    const file = ctx.request.files[0];
    const param = ctx.request.body;
    const dir = await service.banner.saveBannerImg(file);
    const res = await ctx.service.banner.addBannerImg(param, dir);
    if (res) {
      ctx.status = 201;
      ctx.body = { code: res[0], msg: res[1], token: res[2], exp: res[3] };
    } else {
      ctx.body = { code: res[0], msg: res[1] };
    }
  }
}
module.exports = BannerController;
