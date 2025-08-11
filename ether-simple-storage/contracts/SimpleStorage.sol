// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract SimpleStorage {
    int number = 1;

    struct People {
        int likingNumber;
        string name;
    }

    // People public people = People({likingNumber: number,name: "Vicky"});

    People[] public people;
    mapping(string => int) public nameToFavNumber;

    function store(int sum) public virtual {
        number = sum;
        retrive(); // Will cost gas if we using in a function that will gas
    }

    // view function is used for the readonly purpose not for the editing state
    function retrive() public view returns (int) {
        return number;
    } // no gas consumed

    function addPerson(string memory name, int likingNumber) public {
        people.push(People(likingNumber, name));
        nameToFavNumber[name] = likingNumber;
    }
}
// 0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47
