// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage {

    // overriding the parent storage we use 'override' keyword and make parent function a virtual
    function store(int _likingNumber) public  override {
        number = _likingNumber + 5;
    }
}