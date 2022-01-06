// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


library Constants {
    address payable constant BURN_ADDRESS = payable(0x000000000000000000000000000000000000dEaD);

    uint constant TREE_ID = 210001;
    uint constant FRUIT_ID = 220001;
    uint constant FISH_ID = 240013;


    function FIELD_IDS() internal pure returns (uint[] memory res) {
        uint[8] memory const = [uint(271001), 271002, 272001, 272002, 272003, 272004, 272005, 272006];
        res = new uint[](const.length);
        for (uint i = 0; i < res.length; i++) {res[i] = const[i];}
    }

}