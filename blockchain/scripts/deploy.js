const hre = require("hardhat");

async function main() {
  // Get contract factory
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");

  // Deploy contract
  const voting = await VotingSystem.deploy();

  // Wait for deployment
  await voting.waitForDeployment();

  console.log("VotingSystem deployed to:", voting.target);

  // Optional: log admin address
  const admin = await voting.admin();
  console.log("Admin address:", admin);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
