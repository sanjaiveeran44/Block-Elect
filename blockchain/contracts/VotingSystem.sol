// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract VotingSystem {
    address public admin;
    uint256 public electionCount;

    constructor() {
        admin = msg.sender;
    }
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
