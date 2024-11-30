/* eslint-disable import/no-extraneous-dependencies */
const { ethers, upgrades } = require('hardhat');

async function main() {
  const NFTBadgeProxyAddress = 'Nft-Contract-Address';

  console.log('Upgrading NFTBadge to NFTBadgeV2...');
  const NFTBadgeV2 = await ethers.getContractFactory('NFTbadge');
  const upgradeNFTBadge = await upgrades.upgradeProxy(NFTBadgeProxyAddress, NFTBadgeV2);
  await upgradeNFTBadge.waitForDeployment();
  const Address = await upgradeNFTBadge.getAddress();

  console.log('NFTBadge upgraded.', Address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
