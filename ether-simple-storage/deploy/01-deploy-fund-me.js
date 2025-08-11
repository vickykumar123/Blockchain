const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

async function deployFunc(hre) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("Deploying contracts with the account:");
  const chainId = network.config.chainId;
  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [
      ethUsdPriceFeedAddress, // Chainlink ETH/USD price feed address for Sepolia
    ], // constructor arguments
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  // Verify the deployment if on a public network
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, [ethUsdPriceFeedAddress]); // Pass constructor arguments
  }
}
module.exports = deployFunc;
module.exports.tags = ["all", "fundme"]; // Tags for deployment scripts
