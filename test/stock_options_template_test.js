
const EmployeeStockOptionPlan = artifacts.require("EmployeeStockOptionPlan");


contract("EmployeeStockOptionPlan", async () => {
  let accounts = await web3.eth.getAccounts();
  let infinity = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
  let account1 = accounts[0];
  let account2 = accounts[1];


  it("should assert true", async function () {
    const contractTest = await EmployeeStockOptionPlan.deployed();
    console.log(web3.eth.getBalance, "balance");
    assert.equal(1,1)
    
  });
});
