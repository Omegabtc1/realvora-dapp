// Realvora DApp Contract Deployment Script
// This script deploys the Clarity smart contracts to Stacks blockchain

const { StacksTestnet, StacksMainnet } = require('@stacks/network');
const { makeContractDeploy, broadcastTransaction, AnchorMode } = require('@stacks/transactions');
const { readFileSync } = require('fs');
const path = require('path');

// Configuration
const NETWORK = process.env.NETWORK || 'testnet';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_NAME_PREFIX = 'realvora';

if (!PRIVATE_KEY) {
  console.error('Please set PRIVATE_KEY environment variable');
  process.exit(1);
}

// Network configuration
const getNetwork = () => {
  switch (NETWORK) {
    case 'mainnet':
      return new StacksMainnet();
    case 'testnet':
    default:
      return new StacksTestnet();
  }
};

const network = getNetwork();

// Contract deployment configuration
const contracts = [
  {
    name: `${CONTRACT_NAME_PREFIX}-property-nft`,
    file: 'realvora-property-nft.clar',
    description: 'Property NFT contract for tokenized real estate'
  },
  {
    name: `${CONTRACT_NAME_PREFIX}-dao`,
    file: 'realvora-dao.clar',
    description: 'DAO governance contract for property decisions'
  },
  {
    name: `${CONTRACT_NAME_PREFIX}-marketplace`,
    file: 'realvora-marketplace.clar',
    description: 'Marketplace contract for trading property shares'
  }
];

// Deploy a single contract
async function deployContract(contractConfig) {
  try {
    console.log(`\n📄 Deploying ${contractConfig.name}...`);
    console.log(`📝 Description: ${contractConfig.description}`);
    
    // Read contract source code
    const contractPath = path.join(__dirname, contractConfig.file);
    const codeBody = readFileSync(contractPath, 'utf8');
    
    // Create deployment transaction
    const txOptions = {
      contractName: contractConfig.name,
      codeBody,
      senderKey: PRIVATE_KEY,
      network,
      anchorMode: AnchorMode.Any,
      fee: 10000, // 0.01 STX
    };
    
    const transaction = await makeContractDeploy(txOptions);
    
    console.log(`🚀 Broadcasting transaction...`);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    
    if (broadcastResponse.error) {
      console.error(`❌ Deployment failed:`, broadcastResponse.error);
      return { success: false, error: broadcastResponse.error };
    }
    
    console.log(`✅ Contract deployed successfully!`);
    console.log(`📋 Transaction ID: ${broadcastResponse.txid}`);
    console.log(`🔗 Explorer: ${getExplorerUrl(broadcastResponse.txid)}`);
    
    return { 
      success: true, 
      txid: broadcastResponse.txid,
      contractName: contractConfig.name
    };
    
  } catch (error) {
    console.error(`❌ Error deploying ${contractConfig.name}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Get explorer URL for transaction
function getExplorerUrl(txid) {
  const baseUrl = NETWORK === 'mainnet' 
    ? 'https://explorer.stacks.co'
    : 'https://explorer.stacks.co/?chain=testnet';
  return `${baseUrl}/txid/${txid}`;
}

// Wait for transaction confirmation
async function waitForConfirmation(txid, maxAttempts = 30) {
  console.log(`⏳ Waiting for transaction confirmation...`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(`${network.coreApiUrl}/extended/v1/tx/${txid}`);
      const txData = await response.json();
      
      if (txData.tx_status === 'success') {
        console.log(`✅ Transaction confirmed in block ${txData.block_height}`);
        return true;
      } else if (txData.tx_status === 'abort_by_response' || txData.tx_status === 'abort_by_post_condition') {
        console.error(`❌ Transaction failed: ${txData.tx_status}`);
        return false;
      }
      
      console.log(`⏳ Attempt ${attempt}/${maxAttempts} - Status: ${txData.tx_status}`);
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
    } catch (error) {
      console.log(`⏳ Attempt ${attempt}/${maxAttempts} - Checking...`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  console.log(`⚠️  Transaction confirmation timeout. Check manually: ${getExplorerUrl(txid)}`);
  return false;
}

// Main deployment function
async function deployAllContracts() {
  console.log(`🚀 Starting Realvora DApp contract deployment`);
  console.log(`🌐 Network: ${NETWORK}`);
  console.log(`📡 RPC URL: ${network.coreApiUrl}`);
  console.log(`📄 Contracts to deploy: ${contracts.length}`);
  
  const results = [];
  
  for (const contract of contracts) {
    const result = await deployContract(contract);
    results.push(result);
    
    if (result.success) {
      // Wait for confirmation before deploying next contract
      await waitForConfirmation(result.txid);
      
      // Wait additional time between deployments
      console.log(`⏳ Waiting 30 seconds before next deployment...`);
      await new Promise(resolve => setTimeout(resolve, 30000));
    } else {
      console.log(`⚠️  Skipping confirmation wait due to deployment failure`);
    }
  }
  
  // Summary
  console.log(`\n📊 Deployment Summary:`);
  console.log(`=`.repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful deployments: ${successful.length}`);
  successful.forEach(result => {
    console.log(`   - ${result.contractName}: ${result.txid}`);
  });
  
  if (failed.length > 0) {
    console.log(`❌ Failed deployments: ${failed.length}`);
    failed.forEach((result, index) => {
      console.log(`   - ${contracts[results.indexOf(result)].name}: ${result.error}`);
    });
  }
  
  console.log(`\n🎉 Deployment process completed!`);
  
  if (successful.length === contracts.length) {
    console.log(`\n📋 Contract Addresses (save these for frontend integration):`);
    successful.forEach(result => {
      console.log(`${result.contractName}: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.${result.contractName}`);
    });
  }
}

// Handle script execution
if (require.main === module) {
  deployAllContracts().catch(error => {
    console.error('❌ Deployment script failed:', error);
    process.exit(1);
  });
}

module.exports = {
  deployContract,
  deployAllContracts,
  getNetwork,
  contracts
};