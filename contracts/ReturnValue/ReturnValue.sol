// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "hardhat/console.sol";

contract ReturnValue {
    function retVal() external payable returns (uint256 val) {
        assembly {
            val := callvalue()
        }
    }
}
