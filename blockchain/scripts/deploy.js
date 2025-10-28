const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying VotingSystem contract...");

 
  const [deployer] = await hre.ethers.getSigners();

  console.log("👤 Deploying from account:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  
  const Voting = await hre.ethers.getContractFactory("VotingSystem");
  const voting = await Voting.deploy();

  await voting.waitForDeployment();

  console.log("✅ VotingSystem deployed successfully!");
  console.log("📄 Contract Address:", voting.target);
  console.log("👑 Admin Address (msg.sender):", deployer.address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});


// const contract = await hre.ethers.getContractFactory("VotingSystem"); 
// const voting = await contract.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

