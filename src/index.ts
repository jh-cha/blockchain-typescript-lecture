import crypto from "crypto"

interface BlockShape {
    hash: string; 
    prevHash: string;
    height: number;
    data: string;
}
class Block implements BlockShape {
    public hash: string;
    constructor(
        public prevHash: string,
        public height: number,
        public data: string 
    ) {
        this.hash = Block.calculateHash(prevHash, height, data);
    }
    static calculateHash(prevHash: string, height: number, data: string): string{
        const toHash = `${prevHash}${height}${data}`
        return crypto.createHash("sha256").update(toHash).digest("hex");
    }
}

class Blockchain {
    private block: Block[];
    constructor(){
        this.block = [];
    }
    private getPrevHash(){
        if(this.block.length === 0) return ""
        return this.block[this.block.length-1].hash;
    }
    public addBlock(data: string){
        const newBlock = new Block(this.getPrevHash(), this.block.length+1, data);
        this.block.push(newBlock);
    }
    public getBlock(){
        // this.block을 return하는 경우 외부에서 내부 블록 프로퍼티에 접근할 수 있는 이슈 발생
        return [...this.block];
    }
}

const blockchain = new Blockchain();
blockchain.addBlock("First Block");
blockchain.addBlock("Second Block");
blockchain.addBlock("Third Block");

// [...this.block] 전개 연산자로 수정 후 blockchain 프로퍼티에 값이 변경되지 않는다.
blockchain.getBlock().push(new Block("XXX", 111, "HACKED"));

console.log(blockchain.getBlock());
