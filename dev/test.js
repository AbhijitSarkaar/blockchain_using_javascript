const Blockchain = require('./blockchain')

const bitcoin = new Blockchain()
bitcoin.createNewBlock(1231, '8EWAE8AD', '9AFIS8W0')
bitcoin.createNewTransaction(100, 'ALEX2SADFJ34', 'JEN23NJSANI4')
bitcoin.createNewBlock(1232, '43ASDFI2', '1A32FAWE')

console.log(bitcoin)
// console.log(bitcoin.chain[bitcoin.chain.length - 1].transactions)