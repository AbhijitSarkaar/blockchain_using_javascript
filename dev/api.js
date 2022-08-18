const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')
const { v4: uuidv4 } = require('uuid');
const nodeAddress = uuidv4().split('-').join('')

const bitcoin = new Blockchain()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//get all blockchain data
app.get('/blockchain', (req, res) => {
    res.send(bitcoin)
})

//create a new transaction
app.post('/transaction', (req, res) => {
    const {amount, sender, recipient} = req.body
    const blockIndex = bitcoin.createNewTransaction(amount, sender, recipient)
    res.json({note: `Transaction will be to block ${blockIndex}`})
})

//create a new block
app.get('/mine', (req, res) => {

    const lastBlock = bitcoin.getLastBlock()
    const previousBlockHash = lastBlock['hash']
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock.index + 1
    }
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData)
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)

    //rewarding the miner
    //this transaction will be added to the block to be created next
    bitcoin.createNewTransaction(12.5, "00", nodeAddress)

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash)
    res.json({
        note: `new block mined successfully`,
        block: newBlock
    })
})

app.listen(3000, () => {
    console.log('listening to PORT 3000')
})