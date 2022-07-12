//cards routes
import createCardSchema from './createCard.schema.js';
import activateCardSchema from './activateCard.schema.js';
import getBalanceSchema from './getBalance.schema.js';
import blockCardSchema from './blockCard.schema.js';
import unlockCardSchema from './unlockCard.schema.js';
//payments routes
import makePaymentSchema from './makePayment.schema.js';
import makeOnlinePaymentSchema from './makeOnlinePayment.schema.js';
//recharges routes
import makeRechargeSchema from './makeRecharge.schema.js';

export {
  createCardSchema,
  activateCardSchema,
  getBalanceSchema,
  blockCardSchema,
  unlockCardSchema,
  makePaymentSchema,
  makeOnlinePaymentSchema,
  makeRechargeSchema,
};
