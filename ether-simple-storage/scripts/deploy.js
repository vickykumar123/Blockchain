const { ethers, run, network } = require("hardhat");
// const fs = require("fs");
// require("dotenv").config();

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying SimpleStorage...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  const deploymentTransaction = simpleStorage.deploymentTransaction();
  await simpleStorage.waitForDeployment();
  const deployedAddress = await simpleStorage.getAddress();
  console.log("SimpleStorage deployed:", deployedAddress);

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for 6 confirmations before verifying...");
    await deploymentTransaction.wait(6); // Wait for 6 confirmations
    console.log("Verifying contract on Etherscan...");

    await verify(deployedAddress, []);
  }

  // Get current value
  const value = await simpleStorage.retrive();
  console.log("Initial value in contract:", value.toString());
  // Update value
  const storeNumberTx = await simpleStorage.store("42");
  console.log("Storing number in contract...");
  await storeNumberTx.wait(1);
  const updatedValue = await simpleStorage.retrive();
  console.log("Updated value in contract:", updatedValue.toString());
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified");
    } else {
      console.error("Verification failed:", error);
    }
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
