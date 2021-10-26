const Blockchain = require('./blockchain')

const bitcoin = new Blockchain()
bitcoin.createNewBlock(1231, '8EWAE8AD', '9AFIS8W0')
bitcoin.createNewBlock(4331, '4BQD86NSR', '439FWFTW75')
bitcoin.createNewBlock(6543, '7UAIYRND', '1YWOJYTN')

console.log(bitcoin)