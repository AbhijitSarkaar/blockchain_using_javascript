const sha256 = require('sha256')

function Blockchain() {
    this.chain = []
    this.pendingTransactions = []
}

//nonce is a proof of work, used to show that the block was created in a legitimate way
//hash is the hashed version of the data present in the block. 
//the data present in the block is equal to all the transactions present in the block
//every time a new block is created, pending transactions are inserted into the newly created block
//a block is called a ledger, contains a set of transactions

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        transactions: this.pendingTransactions,
        timestamp: Date.now(),
        nonce, 
        hash,
        previousBlockHash
    }

    this.pendingTransactions = [] //once the updated transactions are inserted into the new block, pendingTransactions is emptied and prepared for next
    //set of transactions to be inserted to the next block
    this.chain.push(newBlock) //array to store the blocks
    return newBlock
}

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1]
}

//pendingTransactions are used to contain the pending transactions that are yet to be validated and inserted into the blockchain network
//to insert into the blockchain network, a new block needs to be mined/created
/**
 * 
 * @param {any} amount coin count
 * @param {any} sender address of sender
 * @param {any} recipient address of recipient
 * @returns the index of the block in which this new transaction will be present
 */

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount,
        sender,
        recipient
    }
    this.pendingTransactions.push(newTransaction)
    return this.getLastBlock()['index'] + 1
}   

//hashed value is generated using sha256 algorithm. it takes a string as a input

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
    const hash = sha256(dataAsString)
    return hash
}

module.exports = Blockchain