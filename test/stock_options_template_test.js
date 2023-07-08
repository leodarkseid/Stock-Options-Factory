
const stockOptionsTemplateTest = artifacts.require("EmployeeStockOptionPlan");
import ethers from "ethers";

contract("stockOptionsTemplateTest", function (/* accounts */) {
  it("should assert true", async function () {
    await EmployeeStockOptionPlan.deployed();
    return assert.isTrue(true);
  });
});
