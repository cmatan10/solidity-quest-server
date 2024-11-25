const { ethers } = require('ethers');
const { hints } = require('../data/hints');
const { hintLinks } = require('../data/hintLinks');
const ERC20_ABI = require('../data/SolidityQuestCoin.json');

const ERC20_ADDRESS = process.env.ERC20_CONTRACT_ADDRESS;
const getHint = async (req, res) => {
  const { walletAddress, hintId, Chain } = req.body;

  if (!ethers.isAddress(walletAddress)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  if (!hints[hintId]) {
    return res.status(404).json({ error: 'Hint not found' });
  }

  let rpcUrl;
  if (Chain === 80002) {
    rpcUrl = process.env.RPC_URL_AMOY;
  } else if (Chain === 11155111) {
    rpcUrl = process.env.RPC_URL_SEPOLIA;
  } else {
    return res.status(400).json({ error: 'Unsupported chain' });
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const ERC20Contract = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, provider);

    const bought = await ERC20Contract.hints(walletAddress, hintId);
    if (!bought) {
      return res.status(403).json({ error: 'Hint not purchased yet' });
    }

    const links = hintLinks[hintId] || [];

    res.json({ hint: hints[hintId], hintLinks: links });
  } catch (error) {
    console.error('Error fetching hint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getHint };
