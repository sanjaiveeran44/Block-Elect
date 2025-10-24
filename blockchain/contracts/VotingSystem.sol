// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract VotingSystem {
    address public admin;
    uint256 public electionCount;

    constructor() {
        admin = msg.sender;
    }

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Election {
        uint256 id;
        string title;
        string description;
        bool active;
        uint256 candidateCount;
        mapping(uint256 => Candidate) candidates;
        uint256[] candidateIds;

     
        mapping(address => bool) hasVoted;
        mapping(address => bool) whitelist;
        bool useWhitelist;

        
        mapping(uint256 => address[]) candidateVoters;
    }

    mapping(uint256 => Election) private elections;

    
    event ElectionCreated(uint256 indexed electionId, string title);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name);
    event ElectionStarted(uint256 indexed electionId);
    event ElectionEnded(uint256 indexed electionId);
    event VoterWhitelisted(uint256 indexed electionId, address indexed voter);
    event Voted(uint256 indexed electionId, uint256 indexed candidateId, address indexed voter);

   
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier electionExists(uint256 _electionId) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        _;
    }

   
    function createElection(string memory _title, string memory _description, bool _useWhitelist)
        external
        onlyAdmin
        returns (uint256 newElectionId)
    {
        electionCount++;
        Election storage e = elections[electionCount];
        e.id = electionCount;
        e.title = _title;
        e.description = _description;
        e.useWhitelist = _useWhitelist;
        emit ElectionCreated(electionCount, _title);
        return electionCount;
    }

    function addCandidate(uint256 _electionId, string memory _name)
        external
        onlyAdmin
        electionExists(_electionId)
    {
        Election storage e = elections[_electionId];
        e.candidateCount++;
        uint256 cid = e.candidateCount;
        e.candidates[cid] = Candidate(cid, _name, 0);
        e.candidateIds.push(cid);
        emit CandidateAdded(_electionId, cid, _name);
    }

    function startElection(uint256 _electionId) external onlyAdmin electionExists(_electionId) {
        Election storage e = elections[_electionId];
        require(!e.active, "Already active");
        e.active = true;
        emit ElectionStarted(_electionId);
    }

    function endElection(uint256 _electionId) external onlyAdmin electionExists(_electionId) {
        Election storage e = elections[_electionId];
        require(e.active, "Not active");
        e.active = false;
        emit ElectionEnded(_electionId);
    }

    
    function vote(uint256 _electionId, uint256 _candidateId) external electionExists(_electionId) {
        Election storage e = elections[_electionId];
        require(e.active, "Election not active");
        require(_candidateId > 0 && _candidateId <= e.candidateCount, "Invalid candidate");
        require(!e.hasVoted[msg.sender], "Already voted");

        if (e.useWhitelist) {
            require(e.whitelist[msg.sender], "Not whitelisted");
        }

        e.candidates[_candidateId].voteCount++;
        e.hasVoted[msg.sender] = true;

        // 🔥 NEW: store voter address for this candidate
        e.candidateVoters[_candidateId].push(msg.sender);

        emit Voted(_electionId, _candidateId, msg.sender);
    }

    
    function getCandidate(uint256 _electionId, uint256 _candidateId)
        external
        view
        electionExists(_electionId)
        returns (uint256, string memory, uint256)
    {
        Candidate storage c = elections[_electionId].candidates[_candidateId];
        return (c.id, c.name, c.voteCount);
    }

    function getElection(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (uint256, string memory, string memory, bool, uint256)
    {
        Election storage e = elections[_electionId];
        return (e.id, e.title, e.description, e.active, e.candidateCount);
    }

   
    function getAllCandidates(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (Candidate[] memory)
    {
        Election storage e = elections[_electionId];
        Candidate[] memory result = new Candidate[](e.candidateCount);
        for (uint256 i = 0; i < e.candidateCount; i++) {
            result[i] = e.candidates[e.candidateIds[i]];
        }
        return result;
    }

    
    function getVotersForCandidate(uint256 _electionId, uint256 _candidateId)
        external
        view
        electionExists(_electionId)
        returns (address[] memory)
    {
        Election storage e = elections[_electionId];
        return e.candidateVoters[_candidateId];
    }
}
