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

        bool exists;
    }

    uint256 ids = 1;

    uint256[] public electionIds;
    mapping(uint256 => Election) private elections;

    
    event ElectionCreated(uint256 indexed electionId, string title);
    event ElectionDeleted(uint256 indexed electionId);
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
        require(elections[_electionId].exists == true, "Election does not exist");
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
        e.exists = true;
        electionIds.push(electionCount);
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

        struct ElectionView {
        uint256 id;
        string title;
        string description;
        bool active;
        uint256 candidateCount;
        bool useWhitelist;
    }

    function getAllElections() external view returns (ElectionView[] memory) {
        uint256 len = electionIds.length;
        ElectionView[] memory list = new ElectionView[](len);
        for (uint256 i = 0; i < len; i++) {
            Election storage e = elections[electionIds[i]];
            list[i] = ElectionView({
                id: e.id,
                title: e.title,
                description: e.description,
                active: e.active,
                candidateCount: e.candidateCount,
                useWhitelist: e.useWhitelist
            });
        }
        return list;
    }


    function getElection(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (ElectionView memory)
    {
        Election storage e = elections[_electionId];
        return ElectionView({
            id: e.id,
            title: e.title,
            description: e.description,
            active: e.active,
            candidateCount: e.candidateCount,
            useWhitelist: e.useWhitelist
        });
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

    function deleteElection(uint256 _electionId) external onlyAdmin electionExists(_electionId) {

        elections[_electionId].exists = false;
        uint256 len = electionIds.length;
        for (uint i = 0; i < len; i++) {
            if (electionIds[i] == _electionId) {
                electionIds[i] = electionIds[len - 1];
                electionIds.pop();
                break;
            }
        }
    }

    function getElectionCount() external view returns (uint256) {
        return electionCount;
    }
}


