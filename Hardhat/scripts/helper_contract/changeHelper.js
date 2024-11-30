/* eslint-disable import/no-extraneous-dependencies */

const hre = require('hardhat');

async function main() {
  const nftBadgeAddress = 'Nft-Contract-Address';

  const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
  const nftBadge = NFTBadge.attach(nftBadgeAddress);

  const txNFTBadge = await nftBadge.setHelperAddress('Helper-Contract-Address');
  const receiptNFTBadge = await txNFTBadge.wait();
  console.log('Mint transaction receipt:', receiptNFTBadge);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
