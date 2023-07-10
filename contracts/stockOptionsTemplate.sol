// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EmployeeStockOptionPlan is Ownable, ReentrancyGuard {

    uint256 constant INFINITY = 2**256 - 1;

    struct Employee {
        uint256 stockOptions;
        uint256 vestingSchedule;
    } 
    mapping(address => Employee) public employee;
    mapping(address => uint256) private excercisedBalance;
    mapping(address => uint256) private vestingBalance;


    function addEmployee(address _employeeAddress) public onlyOwner nonReentrant {
        employee[_employeeAddress] = Employee(
            0,
            0
        );
    }

    function grantStockOptions(address _employeeAddress, uint256 _stockOptions) public onlyOwner nonReentrant {
        require(_employeeAddress != address(0) , "Invalid employee address");

        
        employee[_employeeAddress].stockOptions += _stockOptions;
        if (employee[_employeeAddress].vestingSchedule == 0){employee[_employeeAddress].vestingSchedule = INFINITY;}

        emit StockOptionsGranted(_employeeAddress, _stockOptions);
    }

    function setVestingSchedule(address _employeeAddress, uint256 _vestingSchedule) public onlyOwner nonReentrant{
        require(_vestingSchedule > block.timestamp, "vesting schedule must be in the future");
        require(employee[_employeeAddress].stockOptions > 0,"Employee doesn't exist");

        if (employee[msg.sender].stockOptions > 0 && block.timestamp > employee[_employeeAddress].vestingSchedule) {_vest(msg.sender);}
        employee[_employeeAddress].vestingSchedule = _vestingSchedule;
        }
    function getBlockTimeStamp() public view returns(uint256){
        return block.timestamp;
    }

    function vestingCountdown(address _employeeAddress)public view returns(uint256){
        require(employee[_employeeAddress].stockOptions > 0,"Employee doesn't exist");
        return (employee[_employeeAddress].vestingSchedule - block.timestamp) > 0 ?
        (employee[_employeeAddress].vestingSchedule - block.timestamp):0
        ;
    }

    function _vest(address _employeeAddress) internal {
        require(employee[_employeeAddress].vestingSchedule != INFINITY, "Vesting schedule is yet to be set");
        
        if (block.timestamp > employee[_employeeAddress].vestingSchedule){
            vestingBalance[_employeeAddress] += employee[_employeeAddress].stockOptions;
            employee[msg.sender].stockOptions -= employee[_employeeAddress].stockOptions;
            employee[msg.sender].vestingSchedule -= employee[_employeeAddress].vestingSchedule;
        }
    }

    function vestOptions() public nonReentrant{
        require(employee[msg.sender].stockOptions > 0, "This user does not exists or This Employee does not have stock options");
        _vest(msg.sender);
    }



    function exerciseOptions() public nonReentrant{
        require(vestingBalance[msg.sender] > 0 ,"Employee vesting Balance is less than zero or employee doesn't exist");

        
        excercisedBalance[msg.sender] += vestingBalance[msg.sender];
        vestingBalance[msg.sender] -= vestingBalance[msg.sender];
    }

    function getVestedOptions(address _employeeAddress) public view returns(uint256){
        return vestingBalance[_employeeAddress];
    }

    function getExcercisedOptions(address _employeeAddress) public view returns(uint256){
        return excercisedBalance[_employeeAddress];
    }


    function transferOptions(address _recipient, uint256 _stockOptionsAmount)public {
        require(_stockOptionsAmount > 0, "stock options must be greater than zero");
        require(employee[msg.sender].stockOptions > 0, "Employee does not exist");
        require(_stockOptionsAmount <= vestingBalance[msg.sender], "Employee has insufficient vesting balance");

    
        if (employee[msg.sender].stockOptions > 0) {_vest(msg.sender);}

        vestingBalance[msg.sender] -= _stockOptionsAmount;
        vestingBalance[_recipient] += _stockOptionsAmount;
    }

    event StockOptionsGranted(address employee, uint256 stockOptionsAmount);

}