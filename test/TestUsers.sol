pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Users.sol";

contract TestUsers {

    address addr = 0x8Ae4F8fC3eCaf9E9394f037FD54405DBF77daCa2;

    function testSetRole() {

        Users users = Users(DeployedAddresses.Users());

        users.setRole(addr, "insurance", "admin", true).gas(20000);

        bool expected = true;

        Assert.equal(users.hasRole(addr, "insurance", "admin"), expected, "Ad is niet admin.");

    }

}
