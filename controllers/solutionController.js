const { ethers } = require('ethers');
const { solutions } = require('../data/solutions');
const ERC20_ABI = require('../data/SolidityQuestCoin.json');

const ERC20_ADDRESS = process.env.ERC20_CONTRACT_ADDRESS; 

const getSolution = async (req, res) => {
  const { walletAddress, solutionId, Chain } = req.body;

  if (!ethers.isAddress(walletAddress)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  if (!solutions[solutionId]) {
    return res.status(404).json({ error: 'solution not found' });
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

    const bought = await ERC20Contract.solutions(walletAddress, solutionId);
    if (!bought) {
      return res.status(403).json({ error: 'solution not purchased yet' });
    }

    res.json({ solution: solutions[solutionId] });
  } catch (error) {
    console.error('Error fetching solution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getSolution };

