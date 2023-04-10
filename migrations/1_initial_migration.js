const Migrations = artifacts.require("./Migrations.sol");

module.exports = (deployer, network) => {
  if (network == "development") deployer.deploy(Migrations);
};
