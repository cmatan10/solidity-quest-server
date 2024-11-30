/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(13);
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

  const decodeDataAddress = deployInstanceEvents[0].args[0];

  const DecodeData = await hre.ethers.getContractFactory('DecodeData');
  const decodeDataContract = DecodeData.attach(decodeDataAddress);

  const str = 'I Am Number';
  const num = 1;

  try {
    const txDecode = await decodeDataContract.decode(str, num);
    const receiptDecode = await txDecode.wait();
    console.log('decode function transaction receipt:', receiptDecode);
  } catch (error) {
    console.error('Error calling decode:', error.message);
  }

  const player = await decodeDataContract.player();
  console.log('Player struct values:', player);

  if (player._string === str && Number(player._number) === num) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 13);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(13, decodeDataAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 13);
    console.log('Balance of token ID 13 for owner:', bal.toString());
  } else {
    console.log('Player data did not match; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
