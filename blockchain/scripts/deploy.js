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
