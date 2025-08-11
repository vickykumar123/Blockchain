// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract StorageFactory{
    SimpleStorage[] public  simpleStorageArray;

    function createSimpleStorageContract() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    } 

    function sfStore(uint256 simpleStorageIndex, int likingNumber)  public {
        SimpleStorage simpleStorage = simpleStorageArray[simpleStorageIndex];
        simpleStorage.store(likingNumber);
    }

    function sfGet(uint256 simpleStorageIndex) public view returns(int) {
        SimpleStorage simpleStorage = simpleStorageArray[simpleStorageIndex];
        return simpleStorage.retrive();
    }

}
