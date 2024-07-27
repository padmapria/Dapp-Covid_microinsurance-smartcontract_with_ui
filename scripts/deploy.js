// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  // inialize contract with initial balance 
  //https://ethereum.stackexchange.com/questions/106299/ethers-js-deploy-contract-with-balance-payable-constructor
  const initialBalance = ethers.utils.parseEther("50");
  const Covid_Insurance = await hre.ethers.getContractFactory("Covid_Insurance");
  const covid_Insurance = await Covid_Insurance.deploy({ value: initialBalance });
  await covid_Insurance.deployed();
  console.log("covid_Insurance deployed to:", covid_Insurance.address);
      
 fs.writeFileSync('./contract_deployed_endpoint.js', `
  export const covid_Insurance_contract_Addr = "${covid_Insurance.address}"
  export const covid_Insurance_owner_Addr = "${covid_Insurance.signer.address}"
  `)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
