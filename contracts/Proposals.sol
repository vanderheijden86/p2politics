pragma solidity ^0.4.8;
contract Proposals {

  Proposal[] proposals;
  uint length = 0;

  struct Proposal {
    uint id;
    uint parentId;
    bytes32 title;
    bytes32 domain;
    bytes32 category;
    bytes32 phase;
    string description;
    uint maxVoteScale;
    uint startDate;
    uint endDate;
    uint completed;
  }

  function Proposals() {
    length = proposals.push(Proposal(0, 0, "Winkelcentrumpje", "local", "category", "phase", "description", 100, now, now + 2 days, 0));
  }

  function setProposal(uint parentId, bytes32 title, bytes32 domain, bytes32 category, bytes32 phase,
                       string description, uint maxVoteScale, uint endDate, uint completed) returns (uint) {
    length = proposals.push(Proposal(length, parentId, title, domain, category, phase, description, maxVoteScale, now, endDate, completed));
    return length - 1;
  }

  function getProposal(uint index) constant returns (uint, bytes32, bytes32, bytes32, bytes32, string, uint, uint, uint, uint) {
    Proposal p = proposals[index];
    return (p.parentId, p.title, p.domain, p.category, p.phase, p.description, p.maxVoteScale, p.startDate, p.endDate, p.completed);
  }

  function getCount() constant returns (uint) {
    return length;
  }

}
