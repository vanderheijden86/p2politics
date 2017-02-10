pragma solidity ^0.4.4;
contract Users {

  mapping(address => mapping(bytes32 => bool)) roles;

  function Users() {
      address addr = 0x8Ae4F8fC3eCaf9E9394f037FD54405DBF77daCa2;
      roles[addr][sha3("insurance", "admin")] = true;
  }

  function hasRole(address addr, bytes32 domain, bytes32 role) returns (bool) {
    return roles[addr][sha3(domain, role)];
  }

  function setRole(address addr, bytes32 domain, bytes32 role, bool state) returns (bytes32){
    // check if admin. not in hackathon :)!
    // if (!hasRole(tx.origin, domain, "admin")) {
    //    return "setRole requires 'admin' role";
    //}
    roles[addr][sha3(domain, role)] = state;
    return "Role has been set";
  }

  function testje() returns (uint) {
      return 42;
  }
}
