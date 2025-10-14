
pragma solidity ^0.8.17;

contract VotingSystem {
    address public admin;
    uint public candidateCount = 0;
    uint public sessionCount = 0;

    struct Candidate {
        uint id;
        string name;
        uint votes;
    }

    struct VotingSession {
        uint id;
        string name;
        uint[] candidateIds;
        bool active;
        mapping(uint => Candidate) candidates;
    }

    mapping(uint => VotingSession) public sessions;

    mapping(uint => mapping(address => bool)) public hasVoted; // sessionId => voter => bool

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Admin creates a new voting session
    function createSession(string memory sessionName) public onlyAdmin {
        sessionCount++;
        VotingSession storage s = sessions[sessionCount];
        s.id = sessionCount;
        s.name = sessionName;
        s.active = false;
    }

    // Admin adds candidate to a session
    function addCandidate(uint sessionId, string memory candidateName) public onlyAdmin {
        require(sessionId <= sessionCount && sessionId > 0, "Invalid session");
        VotingSession storage s = sessions[sessionId];
        candidateCount++;
        s.candidateIds.push(candidateCount);
        s.candidates[candidateCount] = Candidate(candidateCount, candidateName, 0);
    }

    // Admin starts a voting session
    function startSession(uint sessionId) public onlyAdmin {
        sessions[sessionId].active = true;
    }

    // Admin ends a voting session
    function endSession(uint sessionId) public onlyAdmin {
        sessions[sessionId].active = false;
    }

    // Contestants vote
    function vote(uint sessionId, uint candidateId) public {
        VotingSession storage s = sessions[sessionId];
        require(s.active, "Voting not active");
        require(!hasVoted[sessionId][msg.sender], "You already voted");
        s.candidates[candidateId].votes++;
        hasVoted[sessionId][msg.sender] = true;
    }

    // Get candidate details
    function getCandidate(uint sessionId, uint candidateId) public view returns (string memory, uint) {
        Candidate storage c = sessions[sessionId].candidates[candidateId];
        return (c.name, c.votes);
    }

    // Get all candidate IDs for a session
    function getCandidateIds(uint sessionId) public view returns (uint[] memory) {
        return sessions[sessionId].candidateIds;
    }
}
