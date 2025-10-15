const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("VotingSystem");
  const voting = await Voting.deploy();

  console.log("VotingSystem deployed to:", voting.target);
  console.log("Admin address:", (await hre.ethers.getSigners())[0].address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// admin address = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

// contract address = 0x5FbDB2315678afecb367f032d93F642f64180aa3