'use strict';
/**
 * 管理后台路由分发
 */
module.exports = app => {
  const { router, controller } = app;
  /**
   * 管理员相关接口
   */
  const adminApi = '/admin';
  router.post(`${adminApi}/create`, controller.admin.admin.create);
  router.post(`${adminApi}/login`, controller.admin.admin.login);
  router.post(`${adminApi}/information`, controller.admin.admin.information);
  router.post(`${adminApi}/disable`, controller.admin.admin.disable);
  router.post(`${adminApi}/recovery`, controller.admin.admin.recovery);
  router.put(`${adminApi}/information`, controller.admin.admin.modify);
  router.put(`${adminApi}/modify`, controller.admin.admin.modifyAdmin);
  router.get(`${adminApi}/list`, controller.admin.admin.list);
  // router.get(`${adminApi}/index`, controller.admin.admin.index);
  router.delete(`${adminApi}/delete`, controller.admin.admin.delete);
  router.post(`${adminApi}/search`, controller.admin.admin.searchAdmin);

  /**
   * 分类相关接口
   */
  const categoryApi = '/admin/category';
  router.post(`${categoryApi}/create`, controller.admin.category.create);
  router.delete(`${categoryApi}/delete`, controller.admin.category.del);
  router.get(`${categoryApi}/list`, controller.admin.category.list);
  router.get(`${categoryApi}/List`, controller.admin.category.listOfAdmin);
  router.post(`${categoryApi}/search`, controller.admin.category.searchCategory);
  /**
   * 商品相关接口
   */
  const goodApi = '/admin/goods';
  router.post(`${goodApi}/create`, controller.admin.good.create);
  router.get(`${goodApi}/list`, controller.admin.good.list);
  router.put(`${goodApi}/modify`, controller.admin.good.modifyGood);
  router.delete(`${goodApi}/deleteGood`, controller.admin.good.deleteGood);
  router.post(`${goodApi}/disable`, controller.admin.good.disable);
  router.post(`${goodApi}/recovery`, controller.admin.good.recovery);
  router.post(`${goodApi}/search`, controller.admin.good.searchGood);
  router.post(`${goodApi}/saveImg`, controller.admin.good.saveImg);

  /**
   * 用户相关接口
   */
  const userApi = '/admin/user';
  router.get(`${userApi}/list`, controller.admin.user.list);
  router.post(`${userApi}/create`, controller.admin.user.create);
  router.put(`${userApi}/modify`, controller.admin.user.modifyUser);
  router.post(`${userApi}/disable`, controller.admin.user.disable);
  router.post(`${userApi}/recovery`, controller.admin.user.recovery);
  router.post(`${userApi}/search`, controller.admin.user.searchUser);

  /**
   * 订单相关接口
   */
  const orderApi = '/admin/order';
  router.get(`${orderApi}/list`, controller.admin.order.list);
  router.post(`${orderApi}/sendOut`, controller.admin.order.sendOut);
  router.post(`${orderApi}/search`, controller.admin.order.searchOrder);
  // router.put(`${orderApi}/modify`, controller.admin.order.modifyOrder);
  // router.delete(`${orderApi}/deleteCard`, controller.admin.order.deleteOrder);

  /**
   * 会员卡相关接口
   */
  const cardApi = '/admin/card';
  router.get(`${cardApi}/list`, controller.admin.card.list);
  router.post(`${cardApi}/create`, controller.admin.card.create);
  router.put(`${cardApi}/modify`, controller.admin.card.modifyCard);
  router.delete(`${cardApi}/deleteCard`, controller.admin.card.deleteCard);
  router.post(`${cardApi}/disable`, controller.admin.card.disable);
  router.post(`${cardApi}/recovery`, controller.admin.card.recovery);
  router.post(`${cardApi}/lose`, controller.admin.card.lose);
  router.post(`${cardApi}/search`, controller.admin.card.searchCard);

  /**
   * 规则相关接口
   */
  const ruleApi = '/admin/rule';
  router.post(`${ruleApi}/create`, controller.admin.rule.create);
  router.get(`${ruleApi}/ruleInfo`, controller.admin.rule.ruleInfo);
  router.put(`${ruleApi}/modify`, controller.admin.rule.modifyRule);

  /**
   * 轮播图相关接口
   */
  const bannerApi = '/admin/banner';
  router.post(`${bannerApi}/create`, controller.admin.banner.create);
  router.get(`${bannerApi}/bannerlist`, controller.admin.banner.list);
  router.post(`${bannerApi}/changeImg`, controller.admin.banner.saveImg);
  router.delete(`${bannerApi}/deleteBanner`, controller.admin.banner.deleteBanner);

};
