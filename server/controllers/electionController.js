import {contract} from "../config/contract"
import ethers from "ethers"

const parseElection = (election) =>{
  return {
    id: election[0],
    title: election[1],
    description: election[2],
    active: election[3],
    candidateCount: election[4]
  };
}

const parseCandidate = (candidate) =>{
  return{
    id: candidate[0],
    name: candidate[1].toString(),
    voteCount: candidate[2].toString()
  }
}

const getAllElections = async (req,res) => {
  try {
    const electionCount = await contract.getElectionCount()
    const elections = []
    for(let i = 1;i <= electionCount;i++){
      const election = await contract.getElection(i);
      elections.push(parseElection(election))
    }
    return res.status(200).json({success: true, message: "Elections fetched successfully", data: elections});

  } catch (error) {
    return res.status(500).json({success :false, message: error.message});
  }
}

const getElectionById = async (req, res) => {
  const {id} = req.params;
  const candidates = [];
  const election = await contract.getElection(id);

  try{
    const parsedElection = parseElection(election);
    for(let i = 1;i <= parsedElection.candidateCount;i ++){
      const candidate = await contract.getCandidate(id,i);
      candidates.push(parseCandidate(candidate));
    }
    return res.status(200).json({success: true, message: "Election fetched successfully", data:{election : parsedElection, candidates}});  

  }catch(error){
    return res.status(500).json({success :false, message: error.message});
  }
}

const createElection = async (req, res) =>{
  const {title, description, useWhitelist} = req.body;

  try{
    const transaction = await contract.createElection(title, description, useWhitelist);
    await transaction.wait();

    let electionId = null;
    for(const log of transaction.logs){
      const parsedLog = contract.interface.parseLog(log);

      if(parsedLog.name === "ElectionCreated"){
        electionId = parsedLog.args.electionId.toString();
      }
    }

    return res.status(200).json({success: true, message: "Election created successfully", data:{electionId}});
  }catch(error){
    return res.status(500).json({success :false, message: error.message});
  }
};

const addCandidate = async (req, res) => {
  try {
    const { electionId } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "name required", data: null });

    const tx = await contract.addCandidate(electionId, name);
    const receipt = await tx.wait();

    res.json({ success: true, message: "Candidate added", data: { txHash: receipt.transactionHash } });
  } catch (error) {
    console.error("addCandidate error:", error);
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

const startElection = async (req, res) =>{
  try {
    const { electionId } = req.params;
    const tx = await contract.startElection(electionId);
    const receipt = await tx.wait();
    res.json({ success: true, message: "Election started", data: { txHash: receipt.transactionHash } });
  } catch (error) {
    console.error("startElection error:", error);
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const endElection = async (req, res) => {
  try {
    const { electionId } = req.params;
    const tx = await contract.endElection(electionId);
    const receipt = await tx.wait();
    res.json({ success: true, message: "Election ended", data: { txHash: receipt.transactionHash } });
  } catch (error) {
    console.error("endElection error:", error);
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};


export const getAllCandidates = async (req, res) => {
  try {
    const { electionId } = req.params;

    if (contract.getAllCandidates) {
      const candidates = await contract.getAllCandidates(electionId);
      const formatted = candidates.map(c => ({ id: c.id.toString(), name: c.name, voteCount: c.voteCount.toString() }));
      return res.json({ success: true, message: "Candidates retrieved", data: formatted });
    }

    const election = await contract.getElection(electionId);
    const candidateCount = Number(election[4].toString());
    const candidates = [];
    for (let i = 1; i <= candidateCount; i++) {
      const c = await contract.getCandidate(electionId, i);
      candidates.push({ id: c[0].toString(), name: c[1], voteCount: c[2].toString() });
    }
    res.json({ success: true, message: "Candidates retrieved", data: candidates });
  } catch (error) {
    console.error("getAllCandidates error:", error);
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const getVotersForCandidate = async (req, res) => {
  try {
    const { electionId, candidateId } = req.params;

    const voters = await contract.getVotersForCandidate(electionId, candidateId);
    res.json({ success: true, message: "Voters retrieved", data: voters });
  } catch (error) {
    console.error("getVotersForCandidate error:", error);
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};