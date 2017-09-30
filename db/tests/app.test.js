const expect = require('expect');
const request = require('supertest');

const {app} = require('./../../app');
const {Member} = require('./../models/Member');

beforeEach((done) => {
    Member.remove({}).then(() => done());
});

describe('POST /members', () => {
    it('should create a new member', (done) => {
        let first_name = "Test";
        let last_name = "Test";
        let under_18 = false;
        let birth_year = 1999;

        let object = {
            first_name: first_name,
            last_name: last_name,
            under_18: under_18,
            birth_year: birth_year
        };

        request(app)
            .post('/members')
            .send(object)
            .expect(200)
            .expect((res) => {
                expect(res.body.first_name).toBe(first_name);
                expect(res.body.last_name).toBe(last_name);
                expect(res.body.under_18).toBe(under_18);
                expect(res.body.birth_year).toBe(birth_year);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Member.find().then((members) => {
                    expect(members.length).toBe(1);
                    expect(members[0].first_name).toBe(first_name);
                    expect(members[0].last_name).toBe(last_name);
                    expect(members[0].under_18).toBe(under_18);
                    expect(members[0].birth_year).toBe(birth_year);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create member with invalid body data', (done) => {
        request(app)
            .post('/members')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Member.find().then((members) => {
                    expect(members.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});
