pragma solidity ^0.4.4;
contract Users {

  mapping(address => mapping(bytes32 => uint)) roles;

  function Users() {
     }

  function hasRole(address addr, bytes32 domain, bytes32 role) constant returns (uint, address) {
      return (roles[addr][sha3(domain, role)], addr);
  }

  function setRole(address addr, bytes32 domain, bytes32 role, uint state) returns (bytes32, address) {
    // check if admin. not in hackathon :)!
    // if (!hasRole(tx.origin, domain, "admin")) {
    //    return "setRole requires 'admin' role";
    //}
    roles[addr][sha3(domain, role)] = state;
    return ("Role has been set", addr);
  }

  function testje() returns (uint) {
      return 42;
  }
}
