import { ethers } from "hardhat";
import { EmployeeStockOptionPlan__factory, StockOptionsFactory__factory } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Signer } from "ethers";

describe("Stock Options Contract Deployment and Functionality", function () {
  let contractFactory: EmployeeStockOptionPlan__factory;
  let txt: any;
  let receipt: any;
  let signer: Signer;
  let signer1: Signer;
  let signer2: Signer;
  let contract: any;
  let infinity: number = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
  let newContractAddress: string;

  before(async function () {
    const helpers = require("@nomicfoundation/hardhat-network-helpers");


    const signers = await ethers.getSigners();
    signer = signers[0];
    signer1 = signers[1];
    signer2 = signers[2];

    const stockOptionsfactoryContract = new StockOptionsFactory__factory(signer);
    const factoryContract = await stockOptionsfactoryContract.deploy();
    await factoryContract.deployTransaction.wait();

    const contractAddressCall = await factoryContract.createStockOptionsPlan();
    receipt = await contractAddressCall.wait();
    if (receipt.events && receipt.events[0]) {
        newContractAddress = receipt.events[0].address
      } else {
        throw new Error('No events found');
      }
    contract = EmployeeStockOptionPlan__factory.connect(newContractAddress, signer)

    const callTx = await factoryContract.getDeployedStockOptions();
    txt = await callTx;

    
    
  });

  it("should deploy the contract", async function () {
    expect(Array.isArray(txt)).to.be.true;
    expect(txt).to.include(receipt.events[0].address);
 });

  it("Should grant stock options and create new employees", async function () {
    const contractTx: any = await contract.grantStockOptions(signer1.address, 1000);
    const contractTx0: any = await contract.grantStockOptions(signer.address, 1000);
    const checkEmployee = await contract.employee(signer1.address);
    expect(checkEmployee.stockOptions.toString()).to.equal("1000");
 });

  it("should set the Vesting schedule", async function () {
    const currentTime = await contract.getBlockTimeStamp();
    const recipient = await contract.setVestingSchedule(signer1.address, currentTime + 2000);
    const recipient0 = await contract.setVestingSchedule(signer.address, currentTime + 2000);
    const checkEmployee = await contract.employee(signer1.address);
    const checkEmployee0 = await contract.employee(signer.address);
    expect(checkEmployee.vestingSchedule).to.equal(currentTime + 2000);
    expect(checkEmployee0.vestingSchedule).to.equal(currentTime + 2000);
  });

  it("should claim stock Options", async function () {
    const currentTime = await contract.getBlockTimeStamp();
    
    await time.increase((ethers.utils.hexlify(currentTime)) + 2000);
    const claim = await contract.connect(signer1).vestOptions();
    const checkEmployee = await contract.employee(signer1.address);
    const vestBalance = await contract.getVestedOptions(signer1.address);
    expect(checkEmployee.stockOptions.toString()).to.equal("0");
    expect(vestBalance.toString()).to.equal("1000");
  });

  it("should transfer stock options to other verified employees", async function () {

    const contractTx = await contract.connect(signer1).transferOptions(signer1.address, 1000); 
    const checkEmployee1 = await contract.getVestedOptions(signer1.address);
    await expect(contract.connect(signer1).transferOptions(signer2.address, 1000)).to.be.revertedWith("Employee does not exist");
    expect(checkEmployee1.toString()).to.equal("1000");
    
  });


  it("It should excercise some options", async function () {
    const contractTx = await contract.connect(signer1).exerciseOptions();
    const checkVested = await contract.getVestedOptions(signer1.address);
    const checkExcercised = await contract.getExcercisedOptions(signer1.address);
    expect(checkVested.toString()).to.equal("0");
    expect(checkExcercised.toString()).to.equal("1000");
  });


});
