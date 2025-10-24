import express from 'express'
import {
    getAllElections,
    getElectionById,
    createElection,
    addCandidate,
    startElection,
    endElection,
    getAllCandidates,
    getVotersForCandidate
} from '../controllers/electionController.js'

const router = express.Router();

router.get("/elections", getAllElections);
router.get("/elections/:id", getElectionById);
router.get("/elections/:id/candidates", getAllCandidates);
router.get("/elections/:id/candidates/:cid/voters", getVotersForCandidate);

router.post("/elections", createElection);
router.post("/elections/:id/candidates", addCandidate);

router.put("/elections/:id/start", startElection);
router.put("/elections/:id/end", endElection);

export default router;