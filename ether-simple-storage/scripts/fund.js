const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  console.log("Deploying contracts with the account:", deployer);
  const fundMe = await ethers.getContractAt("FundMe", deployer);
  console.log("FundMe contract deployed at:", fundMe.target);
  const transactionResponse = await fundMe.fund({
    value: ethers.parseEther("0.1"),
  });
  await transactionResponse.wait(1);
  console.log("Funded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
