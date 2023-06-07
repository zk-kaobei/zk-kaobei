import app from '../src/index';
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';


chai.should();
chai.use(chaiHttp); 

describe('Basic APIs', () => {
    describe("/register", () => {
        it("Should able to accept valid identityCommitment", (done) => {
            const payload = {
                identityCommitment: "6828243895505346095515572757220593250316546881300115776179976693064389498337",
                oAuthToken: "",
            }

            chai.request(app)
                .post('/api/register')
                .send(payload)
                .end((err: any, res: any) => {
                    res.should.have.status(200);
                    done();
                })
        })

        it("Should reject invalid identityCommitment", (done) => {
            const payload = {
                identityCommitment: "I_AM_NOT_A_NUMBER",
                oAuthToken: "",
            }

            chai.request(app)
                .post('/api/register')
                .send(payload)
                .end((err: any, res: any) => {
                    res.should.have.status(400);
                    done();
                })
        })

        it("Should reject empty identityCommitment", (done) => {
            const payload = {
                identityCommitment: "",
                oAuthToken: "",
            }

            chai.request(app)
                .post('/api/register')
                .send(payload)
                .end((err: any, res: any) => {
                    res.should.have.status(400);
                    done();
                })
        })
    })
})
