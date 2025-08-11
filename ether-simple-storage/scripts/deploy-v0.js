const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = fs.readFileSync(
    "./contracts_SimpleStorage_sol_SimpleStorage.abi",
    "utf-8"
  );
  const binary = fs.readFileSync(
    "./contracts_SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  // Get fresh nonce
  let currentNonce = await provider.getTransactionCount(
    wallet.address,
    "latest"
  );
  console.log("Starting nonce:", currentNonce);

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying contract...");

  // Deploy with explicit nonce
  const contract = await contractFactory.deploy({ nonce: currentNonce });
  console.log("Contract deployed", contract);

  const deploymentTx = await contract.deploymentTransaction();
  await deploymentTx.wait(1);
  console.log("Deployment confirmed");

  // Small delay to ensure nonce is updated
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Get current value
  const value = await contract.retrive();
  console.log("Initial value in contract:", value.toString());

  // Get fresh nonce using "pending" to get the most up-to-date count
  currentNonce = await provider.getTransactionCount(wallet.address, "pending");
  console.log("Fresh nonce for store transaction:", currentNonce);

  // Use explicit nonce for store transaction
  const storeNumberTx = await contract.store("42", { nonce: currentNonce });
  console.log("Storing number in contract...");
  await storeNumberTx.wait(1);

  const updatedValue = await contract.retrive();
  console.log("Updated value in contract:", updatedValue.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
