const EmployeeStockOptionPlan = artifacts.require("EmployeeStockOptionPlan");

module.exports = function (deployer) {
    deployer.deploy(EmployeeStockOptionPlan);
}