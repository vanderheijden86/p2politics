pragma solidity ^0.4.4;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Users.sol";

contract TestUsers {

    address addr = 0x8Ae4F8fC3eCaf9E9394f037FD54405DBF77daCa2;
    Users users = new Users();

    function testSetRole() {

        //address addrs = DeployedAddresses.Users();
        //Users users = Users(DeployedAddresses.Users.gas(1000)());

        bool expected = true;
        Assert.equal(users.hasRole(addr, "insurance", "admin"), expected, "Ad is niet admin.");

    }

    function testChangeRole() {

        users.setRole(addr, "insurance", "admin", false);

        bool expected = false;
        Assert.equal(users.hasRole(addr, "insurance", "admin"), expected, "Ad is niet admin.");


    }
}
