// Import the Algorand SDK
const algosdk = require('algosdk');

// Connection parameters for the Algorand TestNet
const algodToken = {
    'X-API-Key': 'Your-API-Key-Here'  // Replace with your PureStake API key
};
const algodServer = 'https://testnet-algorand.api.purestake.io/ps2';  // Algorand TestNet
const algodPort = '';

// Initialize Algod client
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Example function to create escrow (we will build it step-by-step)
async function createEscrow() {
    try {
        const accountInfo = await algodClient.accountInformation('Your-Account-Address-Here').do();
        console.log('Account balance: %d microAlgos', accountInfo.amount);
    } catch (error) {
        console.error('Error fetching account balance:', error);
    }
}
