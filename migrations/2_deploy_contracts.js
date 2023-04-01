const ExpenseList = artifacts.require("ExpenseList");

module.exports = function (deployer) {
  deployer.deploy(ExpenseList);
};
