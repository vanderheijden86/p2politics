pragma solidity ^0.4.8;
contract Proposals {

  Proposal[] proposals;
  mapping(uint => uint) proposalDepths;
  uint proposalCount;

  struct Proposal {
    uint id;
    uint iteration;
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
    setProposal(proposalCount, "Winkelcentrumpje", "local", "category", "phase", "description", 100, now + 2 days, 0);
  }

  function setProposal(uint id, bytes32 title, bytes32 domain, bytes32 category, bytes32 phase,
                       string description, uint maxVoteScale, uint endDate, uint completed) returns (uint) {
    proposals.push(Proposal(proposalCount, proposalDepths[proposalCount], title, domain, category, phase, description, maxVoteScale, now, endDate, completed));
    proposalDepths[proposalCount]++;
    proposalCount++;
    return proposalCount;
  }

  function getProposal(uint index) constant returns (uint, uint, bytes32, bytes32, bytes32, bytes32, string, uint, uint, uint, uint) {
    Proposal p = proposals[index];
    return (p.id, p.iteration, p.title, p.domain, p.category, p.phase, p.description, p.maxVoteScale, p.startDate, p.endDate, p.completed);
  }

  function getProposalByIdIteration(uint id, uint iteration) constant returns (uint, uint, bytes32, bytes32, bytes32, bytes32, string, uint, uint, uint, uint) {
    for (uint i = 0; i < proposalCount; i++ ) {
      if (proposals[i].id == id && proposals[i].iteration == iteration) {
        Proposal p = proposals[i];
        return (p.id, p.iteration, p.title, p.domain, p.category, p.phase, p.description, p.maxVoteScale, p.startDate, p.endDate, p.completed);
      }
    }
  }

  function getCount() constant returns (uint) {
    return proposalCount;
  }

}
