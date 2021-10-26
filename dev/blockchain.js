function Blockchain() {
    this.chain = []
    this.newTransactions = []
}

//nonce is a proof of work, used to show that the block was created in a legitimate way
//hash is the data present in the block

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        transactions: this.newTransactions,
        timestamp: Date.now(),
        nonce, 
        hash,
        previousBlockHash
    }

    this.newTransactions = [] //once the updated transactions are inserted into the new block, newTransactions is emptied and prepared for next
    //set of transactions to be inserted to the next block
    this.chain.push(newBlock) //array to store the blocks
    return newBlock
}

module.exports = Blockchain