const {Blockchain, Transaction}= require('./blockchain')
const EC=require('elliptic').ec

const ec=new EC('secp256k1')

const myKey=ec.keyFromPrivate('350e994cb901309831cef25c2feccdb397810e28f6335c5ca43c7af9fb2db85a')

const myWalletAddress=myKey.getPublic('hex')
let savjeecoin=new Blockchain()
const tx1=new Transaction(myWalletAddress, 'Public key goes here', 10)
tx1.signTransaction(myKey)
savjeecoin.addTransaction(tx1)
console.log()
console.log('\n Starting the miner...')

savjeecoin.minePendingTransactions(myWalletAddress)

console.log()
console.log('\n Balance of Ndeta ', savjeecoin.getBalanceOfAddress(myWalletAddress))

// Trying to manipilate and cheat the blockchain will not work as you can see from this test
savjeecoin.chain[1].transactions[0].amount=0
console.log()
console.log( 'Is cahin valid?', savjeecoin.isChainValid())

// savjeecoin.createTransaction(new Transaction('adress 1', 'address 2', 100))
// savjeecoin.createTransaction(new Transaction('adress 2', 'address 1', 50))

// console.log('\n Starting the miner again...')

// savjeecoin.minePendingTransactions('Ndeta')


// console.log('\n Balance of Ndeta again ', savjeecoin.getBalanceOfAddress('Ndeta'))















// TEST CODE
// let savjeecoin=new Blockchain()
// savjeecoin.addBlock(new Block(1,'17/10/2021',  {amount:4}))
// savjeecoin.addBlock(new Block(2,'18/10/2021',  {amount:10}))


// console.log(JSON.stringify( savjeecoin, null, 4))


// // Check if blochain is valid
// console.log('Is Blockchain valid? '  +  savjeecoin.isChainValid())

// savjeecoin.chain[1].transactions={amount:100}

// savjeecoin.chain[1].hash=savjeecoin.chain[1].calculateHash()

// console.log('Is Blockchain valid? '  +  savjeecoin.isChainValid())




// console.log('Mining block 1......')
// savjeecoin.addBlock(new Block(3,'17/10/2021',  {amount:4}))

// console.log('Mining block 3......')
// savjeecoin.addBlock(new Block(2,'18/10/2021',  {amount:10}))
