// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";


contract ERC20Token is ERC20Upgradeable {

    uint8 _decimals;

    function initialize(string memory name_, string memory symbol_, uint8 decimals_, uint initalSupply_) public initializer {
        __ERC20_init(name_, symbol_);

        _decimals = decimals_;

        _mint(msg.sender, initalSupply_ * 10 ** decimals());
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

}
