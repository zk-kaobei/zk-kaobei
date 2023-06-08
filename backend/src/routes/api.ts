import Debug from 'debug';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { keccak256 } from '@ethersproject/keccak256';
import { FullProof } from '@semaphore-protocol/proof'
import { MerkleProof } from '@zk-kit/incremental-merkle-tree';
import { PostData, Post } from '../interfaces/post';
import { PostService } from '../services/post_service';
import { SemaphoreService } from '../services/semaphore_service';
import { create } from 'domain';
import fetch from 'node-fetch';

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const { CLIENT_ID, CLIENT_SECRET } = process.env;
if (process.env.PROD) {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('Missing CLIENT_ID or CLIENT_SECRET');
    }
}

const log = Debug('Kaobei:api');
const router = express.Router();

router.use((req, res, next) => {
    log('Time: ', Date.now());
    next();
});

router.post('/register', async function (req: express.Request, res: express.Response) {
    const { identityCommitment, oAuthToken } = req.body;

    log('User regiser with identityCommitment %s', identityCommitment);
    if (!identityCommitment) {
        res.status(400).json({
            message: 'Missing identityCommitment',
        });
        return;
    }

    if (process.env.PROD) {
        const redirect_url = new URL( req.headers.referer ?? '')
        redirect_url.searchParams.delete('code')

        const data = new URLSearchParams();
        data.append('grant_type', 'authorization_code');
        data.append('code', oAuthToken);
        data.append('client_id', CLIENT_ID!);
        data.append('client_secret', CLIENT_SECRET!);
        data.append('redirect_uri', redirect_url.toString());

        const result: any = await fetch('https://id.nycu.edu.tw/o/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: data.toString(),
        }).then(res => res.json())

        if (result.error) {
            return res.status(400).json({
                message: 'Invalid OAuth token',
            });
        }
    }

    // Add user to Semaphore Service
    try {
        SemaphoreService.Instance.addMember(BigInt(identityCommitment));
        res.status(200).json({
            message: 'Successfully registered',
        });
    } catch (e) {
        res.status(400).json({
            message: 'Something went wrong Q_Q',
        });
    }

    log('User regiser successfully with identityCommitment %s', identityCommitment);
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
            message: 'Something went wrong Q_Q',
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
        // Verify that the proof
        const verified: boolean = await SemaphoreService.Instance.verifyProof(fullProof);
        if (!verified) {
            res.status(403).json({
                message: 'Invalid proof',
            });
            return;
        }

        // Verify that the post data matches the signal in the proof
        const hashedPostData = keccak256(Buffer.from(JSON.stringify({title, body, tags})));
        if (BigInt(hashedPostData) !== BigInt(fullProof.signal)) {
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

        log('Proof verified successfully with nullifierHash %s', fullProof.nullifierHash.toString());

        const uuidOfPost = uuidv4();
        PostService.Instance.addPost(uuidOfPost, {
            id: uuidOfPost,
            title: title,
            body: body,
            tags: tags,
            externalNullifier: BigInt(keccak256(Buffer.from(uuidOfPost))),
            createdAt: Date.now(),
            voteCount: 0,
        });

        res.status(200).json({
            message: 'Successfully posted!',
            postId: uuidOfPost,
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Something went wrong Q_Q',
        });
    }
})

router.get('/posts', async function (req: express.Request, res: express.Response) {
    const posts: Post[] = await PostService.Instance.getPosts();
    if(!posts) {
        res.status(400).json({
            message: 'No posts found',
        });
        return;
    }

    res.status(200).json({
        posts
    });
});

router.post('/vote', async function (req: express.Request, res: express.Response) {
    const { postId, vote, fullProof } = req.body;
    if (!postId || vote == undefined || !fullProof) {
        res.status(400).json({
            message: 'Missing valid parameters',
        });
        return;
    }

    try {
        const post: Post | undefined = await PostService.Instance.getPost(postId);
        if(!post) {
            res.status(400).json({
                message: 'No post found',
            });
            return;
        }

        // Verify that the proof
        const verified: boolean = await SemaphoreService.Instance.verifyProof(fullProof);
        if (!verified) {
            res.status(403).json({
                message: 'Invalid proof',
            });
            return;
        }

        // Verify that the post data matches the signal in the proof
        const hashedPostData = keccak256(Buffer.from(JSON.stringify({postId, vote})));
        if (BigInt(hashedPostData) !== BigInt(fullProof.signal)) {
            res.status(403).json({
                message: 'Malformed post data',
            });
            return;
        }

        // Checking type of postdata
        if (typeof postId !== 'string' || typeof vote !== 'boolean') {
            res.status(403).json({
                message: 'Invalid post data',
            });
            return;
        }

        log('Proof verified successfully with nullifierHash %s', fullProof.nullifierHash.toString());
        const nullified = await PostService.Instance.alreadyNullified(fullProof.nullifierHash);
        if (nullified) {
            res.status(403).json({
                message: 'Already nullified',
            });
            return;
        }

        await PostService.Instance.nullify(fullProof.nullifierHash);
        await PostService.Instance.addVote(postId, vote);

        res.status(200).json({
            message: 'Successfully voted!',
            postId: postId,
            voteCount: post.voteCount,
        });

     } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Something went wrong Q_Q',
        });
    }
})

export default router;
