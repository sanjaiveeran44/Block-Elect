import { ethers } from "ethers";
import VotingSystem from "../blockchain/artifacts/VotingSystem.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = "0xYourDeployedContractAddress";
const votingContract = new ethers.Contract(contractAddress, VotingSystem.abi, signer);

export default votingContract;
