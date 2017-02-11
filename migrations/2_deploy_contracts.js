var Users = artifacts.require("./Users.sol");
var Votes = artifacts.require("./Votes.sol");

module.exports = function(deployer) {
  //deployer.deploy(ConvertLib);
    // deployer.link(ConvertLib, MetaCoin);
    // deployer.deploy(MetaCoin);
    deployer.deploy(Users);
    deployer.deploy(Votes);
};
