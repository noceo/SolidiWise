const ExpenseListFactory = artifacts.require("ExpenseListFactory");

module.exports = function (deployer, network, accounts) {
  if (network == "development") {
    deployer.deploy(ExpenseListFactory, accounts[0]);
  } else if (network == "live") deployer.deploy(ExpenseListFactory, process.env.LIVE_DEPLOY_ADDRESS);
};
