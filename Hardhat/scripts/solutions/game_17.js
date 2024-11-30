/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(17);
  const receipt = await tx.wait();

  console.log('Deploy transaction receipt:', receipt);

  const deployInstanceEvents = await gameFactory.queryFilter(
    gameFactory.filters.DeployInstance(null, null, null),
    receipt.blockNumber,
    receipt.blockNumber,
  );

  console.log('deployInstanceEvents------------------------', deployInstanceEvents);

  if (deployInstanceEvents.length > 0) {
    deployInstanceEvents.forEach((event, index) => {
      console.log(`Instance ${index + 1} deployed at:`, event.args[0]);
    });
  } else {
    console.error('Instance addresses not found in events');
  }

  const educatedGuessAddress = deployInstanceEvents[0].args[0];
  const hackEducatedGuessAddress = deployInstanceEvents[1].args[0];

  const EducatedGuess = await hre.ethers.getContractFactory('EducatedGuess');
  const educatedGuessContract = EducatedGuess.attach(educatedGuessAddress);

  const HackEducatedGuess = await hre.ethers.getContractFactory('HackEducatedGuess');
  const hackEducatedGuessContract = HackEducatedGuess.attach(hackEducatedGuessAddress);

  const guessRange = 1000;

  try {
    const txAttack = await hackEducatedGuessContract.attack(
      educatedGuessAddress,
      hackEducatedGuessAddress,
      guessRange,
    );
    const receiptAttack = await txAttack.wait();
    console.log('Attack transaction receipt:', receiptAttack);
  } catch (error) {
    console.error('Error calling attack:', error.message);
    return;
  }

  const correctGuess = await educatedGuessContract.correctGuess();
  console.log('Was the guess correct?:', correctGuess);

  if (correctGuess) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 17);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(17, educatedGuessAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 17);
    console.log('Balance of token ID 17 for owner:', bal.toString());
  } else {
    console.log('Guess was not correct; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
