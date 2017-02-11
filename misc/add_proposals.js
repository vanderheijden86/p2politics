"use strict";

module.exports = function(callback) {
    // Specifically request an abstraction for MetaCoin.sol
    var Proposals = artifacts.require("../contracts/Proposals.sol");
    var ProposalsData = require("../data/proposals.json");
    //console.log(Proposals);

    var account_one = "0x731e2a7023ba0064805c673d7a171787a5fda8a5"; // an address
    var account_two = "0x8b63b4f484623879dfd924e28469cbcb1b620eaf"; // another address
    var addr = "0x8Ae4F8fC3eCaf9E9394f037FD54405DBF77daCa2";
    var domain = "insurance";
    var role = "admin";



    var proposals;

    Proposals.deployed().then(function(instance) {
        proposals = instance;
        let ProposalsItem = require("index.json");
        return proposals.setProposal(ProposalsItem.parentId, ProposalsItem.title, ProposalsItem.category,
                                     ProposalsItem.description, "proposal", "asdflasj", 10, 39, 4); // {from: account_one});
    }).then(function(result) {
        // If this callback is called, the transaction was successfully processed.
        console.log("Transaction successful!", result);
        callback();
    }).catch(function(e) {
        // There was an error! Handle it.
        console.log("Transaction failed.", e);
        callback();
    })

}
