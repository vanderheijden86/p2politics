pragma solidity ^0.4.4;
contract Users {

  mapping(address => mapping(bytes32 => bool)) roles;

  function Users() {
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
