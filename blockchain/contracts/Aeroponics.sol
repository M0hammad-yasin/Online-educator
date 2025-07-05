// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Aeroponics {
    struct EnvironmentData {
        uint256 temperature;
        uint256 humidity;
        uint256 ec;
        uint256 ph;
        uint256 co2;
        uint256 timestamp;
    }

    EnvironmentData[] public history;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function recordData(
        uint256 temperature,
        uint256 humidity,
        uint256 ec,
        uint256 ph,
        uint256 co2
    ) public onlyOwner {
        history.push(EnvironmentData(temperature, humidity, ec, ph, co2, block.timestamp));
    }

    function getLatestData() public view returns (EnvironmentData memory) {
        require(history.length > 0, "No data available");
        return history[history.length - 1];
    }

    function getHistoryLength() public view returns (uint256) {
        return history.length;
    }
}
