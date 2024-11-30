/* eslint-disable import/no-extraneous-dependencies */
const { ethers, upgrades } = require('hardhat');

async function main() {
  const GameFactoryProxyAddress = '0xb82d87ACD5477e1E5E5650F317F0A4a9EceCb18C';

  console.log('Upgrading GameFactory to GameFactoryV2...');
  const GameFactoryV2 = await ethers.getContractFactory('GameFactory');
  const upgradeGameFactory = await upgrades.upgradeProxy(GameFactoryProxyAddress, GameFactoryV2);
  await upgradeGameFactory.waitForDeployment();
  const Address = await upgradeGameFactory.getAddress();

  console.log('GameFactory upgraded.', Address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
