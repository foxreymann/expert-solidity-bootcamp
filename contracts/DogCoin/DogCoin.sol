// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract DogCoin is ERC20 {
    address[] public holders;
    mapping(address => uint256) public holdersToIndices;

    event holderAdded(address indexed holder);
    event holderRemoved(address indexed holder);

    constructor() ERC20("DogCoin", "DOGCOIN") {
        _addHolder(msg.sender);
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    /* before first transfer to the holder */
    function _addHolder(address _holder) internal {
        if (balanceOf(_holder) != 0) {
            return;
        }
        uint256 idx = holders.length;
        holders.push(_holder);
        holdersToIndices[_holder] = idx;
        emit holderAdded(_holder);
    }

    function transfer(address _to, uint256 _amount) public override returns (bool) {
        _addHolder(_to);
        super.transfer(_to, _amount);
        _removeHolder(msg.sender);
        return true;
    }

    function holdersLength() public view returns (uint256) {
        return holders.length;
    }

    /* execute after transfer from the holder */
    function _removeHolder(address _holder) internal {
        if (balanceOf(_holder) != 0) {
            return;
        }

        uint256 index = holdersToIndices[_holder];

        if (holders.length < 1 || index > holders.length - 1) {
            return;
        }

        // Move the last element into the place to delete
        holders[index] = holders[holders.length - 1];

        // update the index
        holdersToIndices[holders[index]] = index;

        // Remove the last element
        holders.pop();

        emit holderRemoved(_holder);
    }
}
