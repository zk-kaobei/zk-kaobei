import app from '../src/index';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import { Post, PostData } from '../src/interfaces/post';
import { MerkleProof } from '@zk-kit/incremental-merkle-tree';
import { FullProof, generateProof } from "@semaphore-protocol/proof"
import { Group } from '@semaphore-protocol/group';
import { Identity } from '@semaphore-protocol/identity';
import { keccak256 } from '@ethersproject/keccak256';


chai.should();
chai.use(chaiHttp); 

const identity = new Identity();
let merkleProof: MerkleProof;

const postInfo = {
    title: "Hello World",
    body: "This is a test post",
    tags: ["test", "post"],
}

let postId: string;

describe('Basic APIs', () => {
    describe("/register", () => {
        it("Should able to accept valid identityCommitment", () => {
            const payload = {
                identityCommitment: identity.commitment.toString(),
                oAuthToken: "",
            }

            chai.request(app)
                .post('/api/register')
                .send(payload)
                .end((err: any, res: any) => {
                    res.should.have.status(200);
                })
        })

        it("Should reject invalid identityCommitment", () => {
            const payload = {
                identityCommitment: "I_AM_NOT_A_NUMBER",
                oAuthToken: "",
            }

            chai.request(app)
                .post('/api/register')
                .send(payload)
                .end((err: any, res: any) => {
                    res.should.have.status(400);
                })
        })

        it("Should reject empty identityCommitment", () => {
            const payload = {
                identityCommitment: "",
                oAuthToken: "",
            }

            chai.request(app)
                .post('/api/register')
                .send(payload)
                .end((err: any, res: any) => {
                    res.should.have.status(400);
                })
        })
    })

    describe("/merkleproof", () => {
        it("Should able to generate valid proof", () => {
            const payload = {
                identityCommitment: identity.commitment.toString()
            }

            chai.request(app)
                .post('/api/merkleproof')
                .send(payload)
                .end((err: any, res: any) => {
                    res.should.have.status(200);
                    merkleProof = JSON.parse(JSON.stringify(res.body.merkleProof), (key, value) => {
                        if (typeof value === 'string' && value.match(/^[0-9]+n$/))
                        return BigInt(value.slice(0, -1))
                        return value
                    })                    
                })
        })

        it("Should able to reject outsider's identityCommitment", () => {
            const payload = {
                identityCommitment: "6828243895505346095515572757220593250316546881300115776179976693060000000000"
            }

            chai.request(app)
                .post('/api/merkleproof')
                .send(payload)
                .end((err: any, res: any) => {
                    res.should.have.status(400);
                })
        })
    })

    describe("/post", () => {
        it("Should able to post with valid proof", async () => {
            const signal = keccak256(Buffer.from(JSON.stringify(postInfo)));
            const externalNullifier = keccak256(Buffer.from("3.1416"));
            const fullProof: FullProof = await generateProof(identity, merkleProof, externalNullifier, signal, {
                zkeyFilePath: "./snark_artifacts/semaphore.zkey",
                wasmFilePath: "./snark_artifacts/semaphore.wasm"
            });

            const payload = {
                title: postInfo.title,
                body: postInfo.body,
                tags: postInfo.tags,
                fullProof: fullProof,
            }

            const res = await chai.request(app)
                .post('/api/post')
                .send(payload);
            
            postId = res.body.postId;
            expect(res.body.message).to.equal('Successfully posted!');
            expect(res.status).to.equal(200);
        })

        it("Should able to reject a post with invalid proof", async () => {
            const anotherIdentity = new Identity();
            const group = new Group(1, 23, [anotherIdentity.commitment]);
            const signal = keccak256(Buffer.from(JSON.stringify(postInfo)));
            const externalNullifier = keccak256(Buffer.from("3.1416"));
            const invalidFullProof: FullProof = await generateProof(anotherIdentity, group, externalNullifier, signal, {
                zkeyFilePath: "./snark_artifacts/semaphore.zkey",
                wasmFilePath: "./snark_artifacts/semaphore.wasm"
            });

            const payload = {
                title: postInfo.title,
                body: postInfo.body,
                tags: postInfo.tags,
                fullProof: invalidFullProof,
            }

            const res = await chai.request(app)
                .post('/api/post')
                .send(payload);
            expect(res.body.message).to.equal('Invalid proof');
            expect(res.status).to.equal(403);
        })

        it("Should able to reject a post with valid proof but post data is malformed", async () => {
            const signal = keccak256(Buffer.from(JSON.stringify(postInfo)));
            const externalNullifier = keccak256(Buffer.from("3.1416"));
            const fullProof: FullProof = await generateProof(identity, merkleProof, externalNullifier, signal, {
                zkeyFilePath: "./snark_artifacts/semaphore.zkey",
                wasmFilePath: "./snark_artifacts/semaphore.wasm"
            });

            const payload = {
                title: "I'm tainted!",
                body: "Me too!!",
                tags: ["yay"],
                fullProof: fullProof,
            }

            const res = await chai.request(app)
                .post('/api/post')
                .send(payload);
            expect(res.body.message).to.equal('Malformed post data');
            expect(res.status).to.equal(403);
        })

        it("Should able to get post that we posted", async () => {
            const res = await chai.request(app)
                .get('/api/posts')
                .send();
            
            expect(res.status).to.equal(200);
            
            const posts: Post[] = res.body.posts;
            expect(posts[0].title).to.equal(postInfo.title);
            expect(posts[0].body).to.equal(postInfo.body);
            expect(posts[0].tags).to.deep.equal(postInfo.tags);
        })
    })
})

