 
import { expect } from "chai";
import { ethers } from "hardhat";
import type { Aeroponics } from "../typechain-types";

describe("Aeroponics", function () {
  it("should deploy and allow the owner to record and retrieve data", async function () {
    const [owner] = await ethers.getSigners();

    const Aeroponics = await ethers.getContractFactory("Aeroponics");
    const aeroponics = await Aeroponics.deploy();
    await aeroponics.waitForDeployment();

    // Record a sample set of environmental data
    await aeroponics.recordData(25, 60, 1, 6, 350);

    // Get latest data
    const latest = await aeroponics.getLatestData();

    expect(latest.temperature).to.equal(25);
    expect(latest.humidity).to.equal(60);
    expect(latest.ec).to.equal(1);
    expect(latest.ph).to.equal(6);
    expect(latest.co2).to.equal(350);
  });

  it("should prevent non-owner from recording data", async function () {
    const [owner, other] = await ethers.getSigners();

    const Aeroponics = await ethers.getContractFactory("Aeroponics");
    const aeroponics = await Aeroponics.deploy();
    await aeroponics.waitForDeployment();

    // Try to record from a non-owner account
    await expect(
      aeroponics.connect(other).recordData(25, 60, 1, 6, 350)
    ).to.be.revertedWith("Not authorized");
  });
});
