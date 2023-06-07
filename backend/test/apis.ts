import { app } from '../src/index';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';


chai.use(chaiHttp);
chai.should();

describe('Basic APIs', () => {
    describe("Register", () => {
        it("should return 200", (done) => {
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
    })
})
