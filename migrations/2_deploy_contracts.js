const ExpenseListFactory = artifacts.require("ExpenseListFactory");

module.exports = function (deployer) {
  deployer.deploy(ExpenseListFactory);
};
