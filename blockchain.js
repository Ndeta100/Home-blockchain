
const sha256=require('crypto-js/sha256')
const EC=require('elliptic').ec

const ec=new EC('secp256k1')
class Transaction{
    constructor(fromAdress, toAddress, amount){
        this.fromAdress=fromAdress
        this.toAddress=toAddress
        this.amount=amount
    }

    calculateHash(){
        return sha256(this.fromAdress + this.toAddress+ this.amount).toString()
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !==this.fromAdress){
            throw new Error('You cannot sign transactions for other wallets')
        }
      const hashTx=this.calculateHash()
      const sig=signingKey.sign(hashTx, 'base64')
      this.signature=sig.toDER('hex')  
    }

    isValid(){
        if(this.fromAdress===null) return true
        if(!this.signature || this.signature.length===0){
            throw new Error('No signature in this transaction')
        }

        const publicKey=ec.keyFromPublic(this.fromAdress, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature)
    }
}
class Block{
    constructor( timeStamp, transactions, previousHash=''){
        this.timeStamp=timeStamp
        this.transactions=transactions
        this.previousHash=previousHash
        this.hash=this.calculateHash()
        this.nonce=0
    }

    calculateHash(){
     return sha256(this.previousHash + this.timeStamp + JSON.stringify(this.transactions) + this.nonce).toString()
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !==Array(difficulty+1).join('0')){
            this.nonce++
            this.hash=this.calculateHash()
        }
        console.log('Block mined ' + this.hash)
    }

    hasValidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
               return false 
            }
        }

        return true
    }
}



class Blockchain{
    constructor(){
        this.difficulty=2
        this.chain=[this.createGenesisBlock()]
        this.pendingTransactions=[]
        this.miningReward=100
    }
    createGenesisBlock(){
        return new Block('18/10/2021', 'Genesis Block', '0')
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1]
    }
   minePendingTransactions(miningRewardAddress){
       const rewardTx=new Transaction(null, miningRewardAddress, this.miningReward)

       this.pendingTransactions.push(rewardTx)

       let block=new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
       block.mineBlock(this.difficulty)
       console.log('Block successfully mined')
       this.chain.push(block)
       this.pendingTransactions=[]
       
   }

   addTransaction(transaction){
       try {
        if(!transaction.fromAdress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address')
           }
    
           if(!transaction.isValid()){
               throw new Error('Can not add invalid transaction to a chain')
           }
           this.pendingTransactions.push(transaction)

       } catch (error) {
           console.log('ERROR' , error)
       }
       
   }

   getBalanceOfAddress(address){
       let balance =0
       for(const block of this.chain){
          for(const trans of block.transactions){
              if(trans.fromAdress===address){
                  balance-=trans.amount
              }

              if(trans.toAddress===address){
                  balance +=trans.amount
              }
          }

        }
        return balance
   }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock=this.chain[i]
            const previousBlock=this.chain[i-1]
             
            if(!currentBlock.hasValidTransaction()){
                return false
            }
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
module.exports.Blockchain=Blockchain
module.exports.Transaction=Transaction