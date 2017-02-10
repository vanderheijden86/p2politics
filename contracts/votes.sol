contract Votes {

    struct Vote {
        uint userId;
        uint proposalId;
        uint value;
        bool voteRevoked;
        string comment;
        uint timestamp;
    }

    function vote (address userAddress, uint proposalId, uint value) returns (bytes32) {
        Vote.userId = userAddress;
        Vote.proposalId = proposalId


        return "Vote succesful"
    }




}
