import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const pricePerShare = ethers.parseEther("0.01");

  const RealEstateShares = await ethers.getContractFactory(
    "RealEstateShares"
  );

  const contract = await RealEstateShares.deploy(
    "RoyalCity Tower",
    100,
    pricePerShare
  );

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("RealEstateShares deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// output:
// npx hardhat run scripts/deploy.ts --network hardhatMainnet

// WARNING: hre.network.connect() is deprecated and will be removed in a future version. Usehre.network.create() or hre.network.getOrCreate() instead.
// RealEstateShares deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// //RealEstateShares deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3