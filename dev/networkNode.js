const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')
const { v4: uuidv4 } = require('uuid');
const nodeAddress = uuidv4().split('-').join('')
const port = process.argv[2]
const rp = require('request-promise')

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

//register a node and broadcast it to the network
app.post('/register-and-broadcast-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl
    if(bitcoin.networkNodes.indexOf(newNodeUrl) === -1) bitcoin.networkNodes.push(newNodeUrl)

    const registerNodesPromises = []

    //constructing a promise for POST request to each of the existing node at endpoint '/register-node'
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {
                newNodeUrl: newNodeUrl
            },
            json: true
        }
        registerNodesPromises.push(rp(requestOptions)) 
    })

    //once the new node is registered with the network, register existing nodes to the newly added node
    Promise.all(registerNodesPromises).then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {
                allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl], 
            },
            json: true
        }
        return rp(bulkRegisterOptions)
    }).then(data => {
        res.json({note: 'New node registered with network successfully'})
    })
 
})
 
//register a node with the network
app.post('/register-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl
    if(bitcoin.networkNodes.indexOf(newNodeUrl) === -1 && bitcoin.currentNodeUrl !== newNodeUrl) bitcoin.networkNodes.push(newNodeUrl)
    res.json({note: 'New node registered successfully'})
})

//register existing multiple nodes in the network at once into the recently added node
app.post('/register-nodes-bulk', (req, res) => {
    console.log('req.body', req.body)
    const allNetworkNodes = req.body.allNetworkNodes
    allNetworkNodes.forEach(networkNodeUrl => {
        if(bitcoin.networkNodes.indexOf(networkNodeUrl) === -1 && bitcoin.currentNodeUrl !== networkNodeUrl)
            bitcoin.networkNodes.push(networkNodeUrl) 
    })
    res.json({note: 'All Nodes registered successfully to newly added node'})
})

app.listen(port, () => {
    console.log(`listening to PORT ${port}`)
})