// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import "./stockOptionsTemplate.sol";

contract StockOptionsFactory {
    address[] public deployedStockOptions;

    function createStockOptionsPlan() public returns(address){
        EmployeeStockOptionPlan newStockOptions = new EmployeeStockOptionPlan();
        newStockOptions.transferOwnership(msg.sender);

        deployedStockOptions.push(address(newStockOptions));
        return address(newStockOptions);
    }

    function getDeployedStockOptions() public view returns (address[] memory) {
        return deployedStockOptions;
    }
}