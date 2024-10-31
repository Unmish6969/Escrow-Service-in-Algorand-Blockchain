const algosdk = require('algosdk');

// Algorand node connection parameters (make sure to replace these with real values)
const algodToken = {
    'X-API-Key': 'Your-API-Key-Here'
};
const algodServer = 'https://testnet-algorand.api.purestake.io/ps2';
const algodPort = '';
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// The sender and receiver addresses (replace with actual Algorand addresses)
const sender = "Sender-Address-Here";
const receiver = "Receiver-Address-Here";

// Sender's Algorand account mnemonic (secret phrase)
const senderMnemonic = "Your-Sender-Mnemonic-Here";  // Keep this private and secure!
const senderAccount = algosdk.mnemonicToSecretKey(senderMnemonic);

// Example function to fund the escrow smart contract
async function fundEscrow(escrowAddress, amount) {
    try {
        // Get transaction parameters
        let params = await algodClient.getTransactionParams().do();

        // Create a payment transaction
        let txn = {
            "from": senderAccount.addr,
            "to": escrowAddress,
            "fee": algosdk.ALGORAND_MIN_TX_FEE,
            "amount": amount,
            "firstRound": params.firstRound,
            "lastRound": params.lastRound,
            "genesisID": params.genesisID,
            "genesisHash": params.genesisHash,
            "note": undefined
        };

        // Sign the transaction
        let signedTxn = algosdk.signTransaction(txn, senderAccount.sk);

        // Send the transaction
        let tx = await algodClient.sendRawTransaction(signedTxn.blob).do();
        console.log("Transaction ID: " + tx.txId);

        // Wait for transaction confirmation
        await waitForConfirmation(tx.txId);
        console.log("Escrow funded successfully!");

    } catch (error) {
        console.error("Error funding escrow: ", error);
    }
}

// Example function for receiver to withdraw funds after timeout
async function withdrawFromEscrow(escrowAddress, receiverAddress, amount) {
    try {
        // Get transaction parameters
        let params = await algodClient.getTransactionParams().do();

        // Create a payment transaction for withdrawal
        let txn = {
            "from": escrowAddress,
            "to": receiverAddress,
            "fee": algosdk.ALGORAND_MIN_TX_FEE,
            "amount": amount,
            "firstRound": params.firstRound,
            "lastRound": params.lastRound,
            "genesisID": params.genesisID,
            "genesisHash": params.genesisHash,
            "note": undefined
        };

        // Sign the transaction (Note: The contract logic must allow this withdrawal)
        let signedTxn = algosdk.signTransaction(txn, senderAccount.sk);

        // Send the transaction
        let tx = await algodClient.sendRawTransaction(signedTxn.blob).do();
        console.log("Transaction ID: " + tx.txId);

        // Wait for confirmation
        await waitForConfirmation(tx.txId);
        console.log("Withdrawal successful!");

    } catch (error) {
        console.error("Error withdrawing from escrow: ", error);
    }
}

// Helper function to wait for transaction confirmation
async function waitForConfirmation(txId) {
    let response = await algodClient.status().do();
    let lastRound = response["last-round"];
    while (true) {
        const pendingInfo = await algodClient.pendingTransactionInformation(txId).do();
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
            console.log("Transaction confirmed in round", pendingInfo["confirmed-round"]);
            break;
        }
        lastRound++;
        await algodClient.statusAfterBlock(lastRound).do();
    }
}

// Call the functions (as an example)
const escrowAddress = "Escrow-Contract-Address-Here"; // This is the address of the deployed smart contract
const amountToFund = 1000000;  // Amount in microAlgos (1 Algo = 1,000,000 microAlgos)

// Fund the escrow (you can call this when the sender wants to fund the contract)
fundEscrow(escrowAddress, amountToFund);

// Withdraw from escrow (call this once conditions are met for the receiver to withdraw)
withdrawFromEscrow(escrowAddress, receiver, amountToFund);
