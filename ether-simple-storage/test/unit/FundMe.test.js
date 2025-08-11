const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", function () {
  let fundMe, deployer, mockV3Aggregator, mockV3AggregatorDeployment;
  const sendValue = ethers.parseEther("1"); // 1 ETH in wei
  beforeEach(async function () {
    //deploy our fundMe contract
    // using Hardhat-deploy
    deployer = (await getNamedAccounts()).deployer;
    console.log("Deployer address:", deployer);
    await deployments.fixture(["all"]);

    // Get the deployed contract instances
    const fundMeDeployment = await deployments.get("FundMe");
    fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);

    mockV3AggregatorDeployment = await deployments.get("MockV3Aggregator");
    mockV3Aggregator = await ethers.getContractAt(
      "MockV3Aggregator",
      mockV3AggregatorDeployment.address
    );
  });

  describe("constructor", function () {
    it("sets the aggregator addresses correctly", async function () {
      const response = await fundMe.getPriceFeed();
      assert.equal(response, mockV3AggregatorDeployment.address);
    });
  });

  describe("fund", async function () {
    it("fails if you don't send enough ETH", async function () {
      await expect(fundMe.fund()).to.be.revertedWith("Didn't send enough");
    });

    it("updates the amount funded data structure", async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.getAddressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });

    it("adds funder to array of getFunder", async function () {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.getFunder(0);
      assert.equal(funder, deployer);
    });
  });

  describe("withdraw", async function () {
    beforeEach(async function () {
      await fundMe.fund({ value: sendValue });
    });

    it("Cheaper withdraw testing...", async function () {
      const provider = ethers.provider;
      const startingFundMeBalance = await provider.getBalance(fundMe.target);
      const startingDeployerBalance = await provider.getBalance(deployer);

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, gasPrice } = transactionReceipt;
      const gasCost = gasUsed * gasPrice;

      const endingFundMeBalance = await provider.getBalance(fundMe.target);
      const endingDeployerBalance = await provider.getBalance(deployer);

      assert.equal(endingFundMeBalance.toString(), "0");
      assert.equal(
        endingDeployerBalance.toString(),
        (startingDeployerBalance + startingFundMeBalance - gasCost).toString()
      );
    });
    it("allows us to withdraw with multiple getFunder", async function () {
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendValue });
      }

      const startingFundMeBalance = await ethers.provider.getBalance(
        fundMe.target
      );
      const startingDeployerBalance = await ethers.provider.getBalance(
        deployer
      );

      const transactionResponse = await fundMe.cheaperWithdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, gasPrice } = transactionReceipt;
      const gasCost = gasUsed * gasPrice;

      const endingFundMeBalance = await ethers.provider.getBalance(
        fundMe.target
      );
      const endingDeployerBalance = await ethers.provider.getBalance(deployer);

      assert.equal(endingFundMeBalance.toString(), "0");
      assert.equal(
        endingDeployerBalance.toString(),
        (startingDeployerBalance + startingFundMeBalance - gasCost).toString()
      );

      // Check that the getFunder array is reset
      await expect(fundMe.getFunder(0)).to.be.reverted;
    });

    it("allows us to withdraw with multiple getFunder", async function () {
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendValue });
      }

      const startingFundMeBalance = await ethers.provider.getBalance(
        fundMe.target
      );
      const startingDeployerBalance = await ethers.provider.getBalance(
        deployer
      );

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, gasPrice } = transactionReceipt;
      const gasCost = gasUsed * gasPrice;

      const endingFundMeBalance = await ethers.provider.getBalance(
        fundMe.target
      );
      const endingDeployerBalance = await ethers.provider.getBalance(deployer);

      assert.equal(endingFundMeBalance.toString(), "0");
      assert.equal(
        endingDeployerBalance.toString(),
        (startingDeployerBalance + startingFundMeBalance - gasCost).toString()
      );

      // Check that the getFunder array is reset
      await expect(fundMe.getFunder(0)).to.be.reverted;
    });
  });
});
