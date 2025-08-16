const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
async function mockDeployFunc(hre) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  log("Deploying mocks...");

  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...");
    const ethUsdPriceFeed = await deploy("MockV3Aggregator", {
      from: deployer,
      args: [8, 200000000000], // 8 decimals and price of $2000.00 (2000 * 10^8)
      log: true,
    });

    log(`Mock deployed at ${ethUsdPriceFeed.address}`);
  }
}

module.exports = mockDeployFunc;
module.exports.tags = ["all", "mocks"]; // Tags for deployment scripts
