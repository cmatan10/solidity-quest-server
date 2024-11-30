/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(1);
  const receipt = await tx.wait();

  console.log('Deploy transaction receipt:', receipt);

  const deployInstanceEvents = await gameFactory.queryFilter(
    gameFactory.filters.DeployInstance(null, null, null),
    receipt.blockNumber,
    receipt.blockNumber,
  );

  if (deployInstanceEvents.length > 0) {
    deployInstanceEvents.forEach((event, index) => {
      console.log(`Instance ${index + 1} deployed at:`, event.args[0]);
    });
  } else {
    console.error('Instance addresses not found in events');
  }

  const bytes2Address = deployInstanceEvents[0].args[0];

  const Bytes2 = await hre.ethers.getContractFactory('Bytes2');
  const bytes2 = Bytes2.attach(bytes2Address);

  const txBytes2 = await bytes2.increaseNum('0x0001');
  const receiptBytes2 = await txBytes2.wait();

  console.log('increaseNum transaction receipt:', receiptBytes2);
  console.log('New num value:', await bytes2.num());

  const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
  const nftBadge = NFTBadge.attach(nftBadgeAddress);

  const [owner] = await hre.ethers.getSigners();
  console.log('Signer Address:', owner.address);

  const balance = await nftBadge.balanceOf(owner.address, 1);

  if (balance < 1) {
    const txNFTBadge = await nftBadge.mint(1, bytes2Address);
    const receiptNFTBadge = await txNFTBadge.wait();
    console.log('Mint transaction receipt:', receiptNFTBadge);
  }
  const bal = await nftBadge.balanceOf(owner.address, 1);
  console.log('Balance of token ID 1 for owner:', bal.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
