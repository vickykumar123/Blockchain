import {ethers} from "https://unpkg.com/ethers@5.7.2/dist/ethers.esm.min.js";
import {abi, contractAddress} from "./constants.js";
console.log("Welcome to the Fund Me page!");

const connectButton = document.getElementById("connect");
const fundButton = document.getElementById("fund");
const balanceButton = document.getElementById("getBalance");
const withdrawButton = document.getElementById("withdraw");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (window.ethereum) {
    console.log("Ethereum is available");
    await window.ethereum.request({method: "eth_requestAccounts"});
    connectButton.innerText = "Connected to Ethereum";
  } else {
    console.log("Ethereum is not available");
    connectButton.innerText = "Please install MetaMask";
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    const formattedBalance = ethers.utils.formatEther(balance);
    document.getElementById(
      "balance"
    ).innerText = `Contract Balance: ${formattedBalance} ETH`;
  } else {
    console.log("Ethereum provider not found");
    document.getElementById("balance").innerText =
      "Ethereum provider not found";
  }
}

// fund function
async function fund(e) {
  e.preventDefault();
  const ethAmount = document.getElementById("ethAmount").value;
  console.log("Funding...", ethAmount);
  if (typeof window.ethereum !== "undefined") {
    //Provider/ connect to the blockchain
    // signer / wallet / someone with gas
    // contract that we are interacting with
    // ABI (Application Binary Interface)
    // Address of the contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log("Signer:", signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount || "0.01"), // Default to 0.01 ETH if no amount is provided
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Transaction mined:", transactionResponse);
    } catch (error) {
      console.error("Error funding:", error);
      alert("Funding failed. Please check the console for details.");
      return;
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    // Listen for the transaction to be mined
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.cheaperWithdraw();
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Withdrawal successful:", transactionResponse);
    } catch (error) {
      console.error("Error withdrawing:", error);
      alert("Withdrawal failed. Please check the console for details.");
      return;
    }
  }
}
