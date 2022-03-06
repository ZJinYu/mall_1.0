'use strict';
/**
 * 管理后台路由分发
 */
module.exports = app => {
  const { router, controller } = app;
  /**
   * 用户相关接口
   **/
  const userApi = '/business/user';
  router.post(`${userApi}/create`, controller.business.user.create);
  router.post(`${userApi}/login`, controller.business.user.login);
  router.post(`${userApi}/information`, controller.business.user.information);
  router.put(`${userApi}/modify`, controller.business.user.modify);
  router.post(`${userApi}/balanceAdd`, controller.business.user.balanceAdd);
  router.post(`${userApi}/monetary`, controller.business.user.monetary);
  /**
   * 商品相关接口
   **/
  const goodApi = '/business/goods';
  router.get(`${goodApi}/list`, controller.business.good.list);
  router.post(`${goodApi}/search`, controller.business.good.searchGood);
  router.post(`${goodApi}/goodDetail`, controller.business.good.goodDetail);

  /**
   * 订单相关接口
   */
  const orderApi = '/business/order';
  router.post(`${orderApi}/create`, controller.business.order.create);
  router.post(`${orderApi}/orderIndividual`, controller.business.order.orderIndividual);
  router.post(`${orderApi}/receiving`, controller.business.order.receiving);

  /**
   * 会员卡相关接口
   **/
  const cardApi = '/business/card';
  router.post(`${cardApi}/lose`, controller.business.card.userLose);
  router.post(`${cardApi}/cardIndividual`, controller.business.card.cardIndividual);
  router.post(`${cardApi}/pay`, controller.business.card.pay);
  router.post(`${cardApi}/scoreAdd`, controller.business.card.scoreAdd);
  /**
   * 购物车相关接口
   **/
  const cartApi = '/business/cart';
  router.post(`${cartApi}/create`, controller.business.cart.create);
  router.post(`${cartApi}/cartIndividual`, controller.business.cart.cartIndividual);
  router.delete(`${cartApi}/deleteCart`, controller.business.cart.deleteCart);
  router.put(`${cartApi}/modifyCart`, controller.business.cart.modifyCart);
  /**
   * 分类相关接口
   **/
  const categoryApi = '/business/category';
  router.get(`${categoryApi}/List`, controller.business.category.listOfUser);
  /**
   * 规则相关接口
   */
  const ruleApi = '/business/rule';
  router.get(`${ruleApi}/ruleInfo`, controller.business.rule.ruleInfo);

  /**
   * 规则相关接口
   */
  const bannerApi = '/business/banner';
  router.get(`${bannerApi}/bannerList`, controller.business.banner.list);
};
