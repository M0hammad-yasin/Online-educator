import { ethers } from "hardhat";
import type { Aeroponics } from "../typechain-types";

async function main() {
  const Aeroponics = await ethers.getContractFactory("Aeroponics");
  const aeroponics = await Aeroponics.deploy();

  await aeroponics.waitForDeployment();
  console.log("Aeroponics deployed to:", await aeroponics.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
