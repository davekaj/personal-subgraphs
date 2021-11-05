// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract PersonalSubgraphAnchor {
    event AddERC20(address user, address token);
    event AddERC20Sender(address _governance);
    event AddERC721(address _sushi);
    event AddERC721Sender(uint256 _fee);

    function addERC20Sender(address _token) external {
        _addERC20(msg.sender, _token);
    }
    function addERC20(address _user, address _token) external {
        _addERC20(_user, _token);
    }
    function _addERC20(address _user, address _token) internal {
        emit AddERC20(_user, _token);
    }
}
