
const sha256=require('crypto-js/sha256')
class Block{
    constructor(index, timeStamp, data, previousHash=''){

        this.index=index
        this.timeStamp=timeStamp
        this.data=data
        this.previousHash=previousHash
        this.hash=this.calculateHash()
        this.nonce=0


    }

    calculateHash(){
     return sha256(this.index + this.previousHash + this.timeStamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !==Array(difficulty+1).join('0')){
            this.nonce++
            this.hash=this.calculateHash()
        }
        console.log('Block mined ' + this.hash)
    }
}



class Blockchain{
    constructor(){
        this.difficulty=4
        this.chain=[this.createGenesisBlock()]
    }
    createGenesisBlock(){
        return new Block(0, '18/10/2021', 'Genesis Block', '0')
    }

    getLatestBlock(){
   return this.chain[this.chain.length-1]
    }
    addBlock(newBlock){
        newBlock.previousHash=this.getLatestBlock().hash
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock)
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock=this.chain[i]
            const previousBlock=this.chain[i-1]

            if(currentBlock.hash !==currentBlock.calculateHash()){
                return false
            }
            if(currentBlock.previousHash !==previousBlock.hash){
                return false
            }
            
        }
        return true
    }
}

let savjeecoin=new Blockchain()
savjeecoin.addBlock(new Block(1,'17/10/2021',  {amount:4}))
savjeecoin.addBlock(new Block(2,'18/10/2021',  {amount:10}))


console.log(JSON.stringify( savjeecoin, null, 4))


// Check if blochain is valid
console.log('Is Blockchain valid? '  +  savjeecoin.isChainValid())

savjeecoin.chain[1].data={amount:100}

savjeecoin.chain[1].hash=savjeecoin.chain[1].calculateHash()

console.log('Is Blockchain valid? '  +  savjeecoin.isChainValid())




console.log('Mining block 1......')
savjeecoin.addBlock(new Block(3,'17/10/2021',  {amount:4}))

console.log('Mining block 3......')
savjeecoin.addBlock(new Block(2,'18/10/2021',  {amount:10}))
