module.exports = function(callback) {
// Specifically request an abstraction for MetaCoin.sol
var MetaCoin = artifacts.require("../contracts/MetaCoin.sol");
console.log(MetaCoin);

var account_one = "0x731e2a7023ba0064805c673d7a171787a5fda8a5"; // an address
var account_two = "0x8b63b4f484623879dfd924e28469cbcb1b620eaf"; // another address

var meta;
MetaCoin.deployed().then(function(instance) {
  meta = instance;
  return meta.sendCoin(account_two, 10, {from: account_one});
}).then(function(result) {
  // If this callback is called, the transaction was successfully processed.
    console.log("Transaction successful!");
    callback();
}).catch(function(e) {
    // There was an error! Handle it.
    console.log("Transaction failed.", e);
    callback();
})
}
