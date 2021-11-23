const Blockchain = require('./blockchain')

//testing creation of new block and pending transactions

const bitcoin = new Blockchain()
// bitcoin.createNewBlock(1231, '8EWAE8AD', '9AFIS8W0')
// bitcoin.createNewTransaction(100, 'ALEX2SADFJ34', 'JEN23NJSANI4')
// bitcoin.createNewBlock(1232, '43ASDFI2', '1A32FAWE')

// console.log(bitcoin)
// console.log(bitcoin.chain[bitcoin.chain.length - 1].transactions)

//testing block hash 

const previousBlockHash = 'IUEFUQOYGO1231'
const currentBlockData = [{amount: 100, sender: 'QWERQWER',recipient: 'QWERQWER'}]
const nonce = 100

const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)
console.log(hash)