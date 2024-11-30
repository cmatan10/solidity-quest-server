/* eslint-disable import/no-extraneous-dependencies */
const { ethers, upgrades } = require('hardhat');

async function main() {
  const helperProxyAddress = 'Helper-Contract-Address';

  console.log('Upgrading Helper to HelperV2...');
  const Helper = await ethers.getContractFactory('Helper');
  const upgradedHelper = await upgrades.upgradeProxy(helperProxyAddress, Helper);
  await upgradedHelper.waitForDeployment();
  const Address = await upgradedHelper.getAddress();
  console.log('Helper upgraded. New implementation at:', Address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
