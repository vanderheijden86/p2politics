var Users = artifacts.require("./Users.sol");
var Votes = artifacts.require("./Votes.sol");
var Proposals = artifacts.require("./Proposals.sol");

module.exports = function(deployer) {
  //deployer.deploy(ConvertLib);
    // deployer.link(ConvertLib, MetaCoin);
    // deployer.deploy(MetaCoin);
    deployer.deploy(Users);
    deployer.deploy(Votes);
    deployer.deploy(Proposals);
};
