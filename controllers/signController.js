const { ethers } = require('ethers');
require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error('Please set PRIVATE_KEY in your .env file');
}

const signer = new ethers.Wallet(privateKey);

const signMessage = async (req, res) => {
  const { score, walletAddress } = req.body;

  if (!score || !walletAddress) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (score <= 0) {
    return res.status(400).json({ error: 'Invalid score' });
  }

  try {
    const amount = ethers.parseUnits(score.toString(), 18);
    const nonce = Math.floor(Date.now() / 1000);

    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'uint256'],
      [walletAddress, amount, nonce],
    );

    console.log('Backend messageHash:', messageHash);

    const signature = await signer.signMessage(ethers.getBytes(messageHash));
    res.json({ signature, nonce });
  } catch (error) {
    console.error('Error signing message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { signMessage };

