import { BigNumberish, Group } from '@semaphore-protocol/group'
import { Identity } from '@semaphore-protocol/identity'
import { Proof, FullProof, verifyProof } from '@semaphore-protocol/proof'
import { keccak256 } from '@ethersproject/keccak256'
import { debug } from 'debug';
import { log } from 'console';


export class SemaphoreService {
    private static _instance: SemaphoreService;

    TREE_DEPTH: number = 23;
    GROUP_ID: bigint = BigInt(keccak256(Buffer.from('GLOBAL'.split('').map(c => c.charCodeAt(0)))));
    group: Group;

    constructor() {
        this.group = new Group(this.GROUP_ID, this.TREE_DEPTH);
    }

    /**
     * Load identity commitments from storage to reconstruct the group
     * @note This function is not implemented yet
     */
    loadFromStorage(identityCommitments: BigNumberish[]) {
    }

    /**
     * Generate Merkle proof for the identity commitment
     * @returns undefined if the identity commitment is not in the group
     */
    async genMerkleProof(identityCommitment: BigNumberish) {
        const identityIndex = this.group.indexOf(identityCommitment);
        if (identityIndex == -1)
            return undefined;

        return this.group.generateMerkleProof(identityIndex);
    }

    /**
     * Add a new member to the group
     */
    async addMember(identityCommitment: BigNumberish) {
        this.group.addMember(identityCommitment);
    }

    /**
     * Get group object presented in the service
     * @returns group object
     */
    async getGroup() {
        return this.group;
    }

    /**
     * Verify the proof
     */
    async verifyProof(fullProof: FullProof) {
        const craftedProof: FullProof = {
            merkleTreeRoot: BigInt(this.group.root),
            nullifierHash: fullProof.nullifierHash,
            proof: fullProof.proof,
            signal: fullProof.signal,
            externalNullifier: fullProof.externalNullifier,
        }

        return verifyProof(craftedProof, this.TREE_DEPTH);
    }

    /**
     * Get singleton instance of the service
     */
    public static get Instance() {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}
