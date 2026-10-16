import { expect } from "chai";
import { network } from "hardhat";

describe("RealEstateShares", function () {
  async function deployContract() {
    const { ethers } = await network.connect();

    const [owner, buyer] = await ethers.getSigners();

    const RealEstateShares = await ethers.getContractFactory(
      "RealEstateShares"
    );

    const pricePerShare = ethers.parseEther("0.01");

    const contract = await RealEstateShares.deploy(
      "RoyalCity Tower",
      100,
      pricePerShare
    );

    await contract.waitForDeployment();

    return {
      contract,
      owner,
      buyer,
      pricePerShare,
    };
  }

  it("should set the property details correctly", async function () {
    const { contract, pricePerShare } = await deployContract();

    expect(await contract.propertyName()).to.equal("RoyalCity Tower");
    expect(await contract.totalShares()).to.equal(100);
    expect(await contract.pricePerShare()).to.equal(pricePerShare);
    expect(await contract.sharesSold()).to.equal(0);
  });

  it("should allow a user to buy shares", async function () {
    const { contract, buyer, pricePerShare } = await deployContract();

    const shareAmount = 5;
    const totalCost = pricePerShare * BigInt(shareAmount);

    await contract
      .connect(buyer)
      .buyShares(shareAmount, { value: totalCost });

    expect(await contract.sharesOwned(buyer.address)).to.equal(5);
    expect(await contract.sharesSold()).to.equal(5);
    expect(await contract.sharesAvailable()).to.equal(95);
  });

  it("should reject buying zero shares", async function () {
    const { contract, buyer } = await deployContract();

    await expect(
      contract.connect(buyer).buyShares(0, { value: 0 })
    ).to.be.revertedWith("Share amount must be greater than 0");
  });

  it("should reject buying more shares than available", async function () {
    const { contract, buyer, pricePerShare } = await deployContract();

    const shareAmount = 101;
    const totalCost = pricePerShare * BigInt(shareAmount);

    await expect(
      contract
        .connect(buyer)
        .buyShares(shareAmount, { value: totalCost })
    ).to.be.revertedWith("Not enough shares available");
  });

  it("should reject incorrect ETH amount", async function () {
  const { contract, buyer } = await deployContract();

  await expect(
    contract
      .connect(buyer)
      .buyShares(5, {
        value: 1n,
      })
  ).to.be.revertedWith("Incorrect ETH amount");
});

  it("should emit SharesPurchased event", async function () {
    const { contract, buyer, pricePerShare } = await deployContract();

    const shareAmount = 5;
    const totalCost = pricePerShare * BigInt(shareAmount);

    await expect(
      contract
        .connect(buyer)
        .buyShares(shareAmount, { value: totalCost })
    )
      .to.emit(contract, "SharesPurchased")
      .withArgs(buyer.address, shareAmount);
  });
});