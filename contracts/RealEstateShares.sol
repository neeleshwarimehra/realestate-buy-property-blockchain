// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RealEstateShares {
    // Property information
    string public propertyName;
    uint256 public totalShares;
    uint256 public pricePerShare;
    uint256 public sharesSold;

    // Tracks how many shares each wallet owns
    mapping(address => uint256) public sharesOwned;

    // Event emitted whenever shares are purchased
    event SharesPurchased(
        address indexed buyer,
        uint256 amount
    );

    // Set property details when the contract is deployed
    constructor(
        string memory _propertyName,
        uint256 _totalShares,
        uint256 _pricePerShare
    ) {
        propertyName = _propertyName;
        totalShares = _totalShares;
        pricePerShare = _pricePerShare;
        sharesSold = 0;
    }

    // Buy shares by sending the required amount of ETH
    function buyShares(uint256 shareAmount) external payable {
        require(
            shareAmount > 0,
            "Share amount must be greater than 0"
        );

        require(
            sharesSold + shareAmount <= totalShares,
            "Not enough shares available"
        );

        uint256 requiredETH = shareAmount * pricePerShare;

        require(
            msg.value == requiredETH,
            "Incorrect ETH amount"
        );

        sharesOwned[msg.sender] += shareAmount;
        sharesSold += shareAmount;

        emit SharesPurchased(msg.sender, shareAmount);
    }

    // Returns remaining shares
    function sharesAvailable() external view returns (uint256) {
        return totalShares - sharesSold;
    }
}