/* eslint-disable import/no-extraneous-dependencies */
const { ethers, upgrades } = require('hardhat');

async function main() {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  console.log(deployer);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Deployer balance:', ethers.formatEther(balance), 'MATIC');

  const Helper = await ethers.getContractFactory('Helper', deployer);
  console.log('Deploying Helper...');
  const helper = await upgrades.deployProxy(Helper);
  await helper.waitForDeployment();
  const helperAddress = await helper.getAddress();
  console.log('Helper deployed to:', helperAddress);

  const NFTbadge = await ethers.getContractFactory('NFTbadge', deployer);
  console.log('Deploying NFTbadge...');
  const nft = await upgrades.deployProxy(NFTbadge, [helperAddress], { initializer: 'initialize' });
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log('NFTbadge deployed to:', nftAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*
GameFactory deployed to: 0xb82d87ACD5477e1E5E5650F317F0A4a9EceCb18C
Helper deployed to: 0x2247Ed1587b7D774CCa8253C333882a301D74B27
NFTbadge deployed to: 0x615791b21182FDE04Cdc4f7D31762b0D79Ebc158
deployer: 0x2d1C9A3C168D12D124E7538C759934D9B9559E59
ERC20 deployed to: 0x614AAb8ce831896Ffe4375c2DC72fF93da876EFf
*/
