
const EmployeeStockOptionPlan = artifacts.require("EmployeeStockOptionPlan");


contract("EmployeeStockOptionPlan", async (accounts) => {
  
  let infinity = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
  let signer = accounts[0];
  let signer1 = accounts[1];

  it("Should grant stock options and create new employees", async function () {
    const contract = await EmployeeStockOptionPlan.deployed();
    const contractTx = await contract.grantStockOptions(signer1, 1000);
    const contractTx0 = await contract.grantStockOptions(signer, 1000);
    const checkEmployee = await contract.employee(signer1);
    console.log(signer)
    expect(checkEmployee.stockOptions.toString()).to.equal("1000");
 });
 it("should deploy the contract", async function () {
  const contract = await EmployeeStockOptionPlan.deployed();
  expect(contract.address).to.not.equal(undefined);
});

it("should set the Vesting schedule", async function () {
  const contract = await EmployeeStockOptionPlan.deployed();
  const currentTime = await contract.getBlockTimeStamp();
  const recipient = await contract.setVestingSchedule(signer1, currentTime + 2000);
  const recipient0 = await contract.setVestingSchedule(signer, currentTime + 2000);
  const checkEmployee1 = await contract.employee(signer1);
  const checkEmployee0 = await contract.employee(signer);
  expect(checkEmployee1.vestingSchedule.toString()).to.equal(currentTime + 2000);
  expect(checkEmployee0.vestingSchedule.toString()).to.equal(currentTime + 2000);
});



});
