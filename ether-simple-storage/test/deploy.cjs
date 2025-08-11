const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", () => {
  let SimpleStorage, simpleStorage;
  beforeEach(async () => {
    this.SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    this.simpleStorage = await this.SimpleStorage.deploy();
    await this.simpleStorage.waitForDeployment();
  });
  it("should start with a stored value of 1", async () => {
    const storedValue = await this.simpleStorage.retrive();
    expect(storedValue).to.equal(1);
  });

  it("should update the stored value", async () => {
    const newValue = 42;
    const tx = await this.simpleStorage.store(newValue);
    await tx.wait(1);
    const storedValue = await this.simpleStorage.retrive();
    expect(storedValue).to.equal(newValue);
  });
});
