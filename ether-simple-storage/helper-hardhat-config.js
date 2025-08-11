const networkConfig = {
  31337: {
    name: "localhost",
    rpcUrl: "http://localhost:8545",
    chainId: 31337,
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // Localhost price feed
  },
  11155111: {
    name: "sepolia",
    rpcUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
    chainId: 11155111,
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // Sepolia price feed
  },
};

module.exports = {
  networkConfig,
  developmentChains: ["hardhat", "localhost"],
  VERIFICATION_BLOCK_CONFIRMATIONS: 6,
  MINIMUM_USD: "50", // Minimum amount in USD to fund
  FUND_ME_CONTRACT_NAME: "FundMe",
  PRICE_CONVERTER_LIBRARY_NAME: "PriceConvertor",
  namedAccounts: {
    deployer: {
      default: 0, // Default account for deployment
    },
  },
};
