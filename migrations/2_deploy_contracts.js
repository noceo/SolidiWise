const ExpenseListFactory = artifacts.require("ExpenseListFactory");

module.exports = function (deployer, network, accounts) {
  if (network == "development") {
    deployer.deploy(ExpenseListFactory, accounts[0]);
  } else if (network == "live") console.log(process.env.LIVE_DEPLOY_ADDRESS);
};
