import express from 'express';
import Debug from 'debug';
import { SemaphoreService } from '../semaphore_service';
import { MerkleProof } from '@zk-kit/incremental-merkle-tree';


const log = Debug('Kaobei:api');
const semaphoreService = new SemaphoreService();
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
        semaphoreService.addMember(BigInt(identityCommitment));
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
        res.status(418).json({
            message: 'Missing identityCommitment',
        });
        return;
    }

    try {
        const merkleProof: MerkleProof | undefined = await semaphoreService.genMerkleProof(BigInt(identityCommitment));
        if (merkleProof === undefined) {
            // identityCommitment not found within group
            res.status(418).json({
                message: 'Identity commitment not found',
            });
            return;
        }
        res.status(200).json({
            message: 'Successfully generated merkle proof',
            merkleProof: merkleProof,
        });

    } catch (e) {
        res.status(400).json({
            message: "Something went wrong Q_Q",
        });
    }
});

export default router;
