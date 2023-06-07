import express from 'express';
import Debug from 'debug';
import { SemaphoreService } from '../services/semaphore_service';
import { FullProof } from "@semaphore-protocol/proof"
import { MerkleProof } from '@zk-kit/incremental-merkle-tree';
import { PostData, Post } from '../interfaces/post';
import { keccak256 } from '@ethersproject/keccak256';


const log = Debug('Kaobei:api');
const router = express.Router();

router.use((req, res, next) => {
    log('Time: ', Date.now());
    next();
});

router.post('/register', async function (req: express.Request, res: express.Response) {
    const { identityCommitment, oAuthToken } = req.body;

    log("User regiser with identityCommitment %s", identityCommitment);
    if (!identityCommitment) {
        res.status(400).json({
            message: 'Missing identityCommitment',
        });
        return;
    }

    // TODO: Verify NYCU OAuth token

    // Add user to Semaphore Service
    try {
        SemaphoreService.Instance.addMember(BigInt(identityCommitment));
        res.status(200).json({
            message: 'Successfully registered',
        });
    } catch (e) {
        res.status(400).json({
            message: "Something went wrong Q_Q",
        });
    }

    log("User regiser successfully with identityCommitment %s", identityCommitment);
});

router.post('/merkleproof', async function (req: express.Request, res: express.Response) {
    const { identityCommitment } = req.body;
    if (!identityCommitment) {
        res.status(400).json({
            message: 'Missing identityCommitment',
        });
        return;
    }

    try {
        const merkleProof: MerkleProof | undefined = await SemaphoreService.Instance.genMerkleProof(BigInt(identityCommitment));
        if (merkleProof === undefined) {
            // identityCommitment not found within group
            res.status(400).json({
                message: 'Identity commitment not found',
            });
            return;
        }
        res.status(200).json({
            message: 'Successfully generated merkle proof',
            merkleProof: merkleProof,
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Something went wrong Q_Q",
        });
    }
});

router.post('/post', async function (req: express.Request, res: express.Response) {
    const { title, body, tags, fullProof } = req.body;
    if (!title || !body || !tags || !fullProof) {
        res.status(400).json({
            message: 'Missing valid parameters',
        });
        return;
    }

    try {
        const restoredProof: FullProof = JSON.parse(JSON.stringify(fullProof), (key, value) => {
            if (typeof value === 'string' && value.match(/^[0-9]+n$/))
            return BigInt(value.slice(0, -1))
            return value
        })

        // Verify that the proof
        const verified: boolean = await SemaphoreService.Instance.verifyProof(restoredProof);
        if (!verified) {
            res.status(403).json({
                message: 'Invalid proof',
            });
            return;
        }

        // Verify that the post data matches the signal in the proof
        const hashedPostData = keccak256(Buffer.from(JSON.stringify({title, body, tags})));
        if (BigInt(hashedPostData) !== BigInt(restoredProof.signal)) {
            res.status(403).json({
                message: 'Malformed post data',
            });
            return;
        }

        // Checking type of postdata
        if (typeof title !== 'string' || typeof body !== 'string' || !Array.isArray(tags)) {
            res.status(403).json({
                message: 'Invalid post data',
            });
            return;
        }
        
        log("Proof verified successfully with nullifierHash %s", restoredProof.nullifierHash.toString());

        // TODO: Store post data
        res.status(200).json({
            message: 'Successfully posted!',
        });
    
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Something went wrong Q_Q",
        });
    }
})

export default router;
