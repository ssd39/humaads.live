// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HuMa is ERC20, Ownable {

    constructor() Ownable(msg.sender)  ERC20("Humaads", "HuMa") {
        _mint(msg.sender, 1000 ether);
    }

    uint256 adCampaignCouner = 0;
    mapping(address => uint256) userBalance;
    mapping(uint256 => address) campaingOwners;
    mapping(uint256 => uint256) campaignSpent;

    event BalanceTopUp(address user, uint256 amount);
    event NewCampaingAdded(address user, uint256 campaingId);
    event CampaingCharged(address user, uint256 campaignId, uint256 amount);

    function topup(uint256 amount) external {
        transfer(address(this), amount);
        userBalance[msg.sender] += amount;
        emit BalanceTopUp(msg.sender, amount);
    }

    function mint(uint256 amount) onlyOwner external {
        _mint(msg.sender, amount);
    }

    function addCampaing() external {
        campaingOwners[adCampaignCouner] = msg.sender;
        emit NewCampaingAdded(msg.sender, adCampaignCouner);
        adCampaignCouner += 1;
    }

    function charge(uint256 campaignId, uint256 amount) onlyOwner external {
        address campaignOwner = campaingOwners[campaignId];
        require(userBalance[campaignOwner] >= amount, "unsufficent_balance");
        campaignSpent[campaignId] += amount;
        userBalance[campaignOwner] -= amount;
        emit CampaingCharged(campaignOwner, campaignId, amount);
    }

    function topupbalance(address user) public view returns (uint256) {
        return userBalance[user];
    }
}
