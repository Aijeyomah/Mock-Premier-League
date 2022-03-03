import chai from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';

import app from '../../src/index';
import { createFixture , editFixture } from './dummy.data';

const fixtureBaseUrl = '/api/v1/fixture';

const { expect } = chai;
chai.use(chaiHttp)

describe('Fixture Tests', () => {
    describe('Add Fixture', () => {
        it('It should throw error when no token is provided', (done) => {
            chai
                .request(app)
                .post(fixtureBaseUrl)
                .send(createFixture)
                .end((err, res) => {
                    const { message, status } = res.body;
                    expect(res.status).to.equal(401);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        'Access denied,a valid access token is required',
                    );
                    
                    done();
                });
        });

        it('It should throw error when access is not granted', (done) => {
            chai
                .request(app)
                .post(fixtureBaseUrl)
                .set({
                    Authorization: `Bearer ${ process.env.USER_ONE_ACCESS_TOKEN}`,
                })
                .send(fixtureBaseUrl)
                .end((err, res) => {
                    console.log(res.body.message)
                    const { message, status } = res.body;
                    expect(res.status).to.equal(403);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        'You required a higher access level to utilize this resource',
                    );
                   
                    done();
                });
        });


        it('It successfully add a team', (done) => {
            chai
                .request(app)
                .post(fixtureBaseUrl)
                .set({
                    Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
                })

                .send(createFixture)
                .end((err, res) => {
                    const { message, status, data } = res.body;
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(message).to.equal(
                        'Successfully created fixtures',
                    );
                    expect(status).to.equal('success');
                    expect(data).to.be.a('object');
                    process.env.FIXTURE_ONE_ID = res.body.data._id;
                    done();
                });
        });

    })

    describe('delete fixture', () => {
        it('It should throw error when no token is provided', (done) => {
            chai
                .request(app)
                .delete(`${fixtureBaseUrl}/${process.env.FIXTURE_ONE_ID}`)
                .send(createFixture)
                .end((err, res) => {
                    const { message, status } = res.body;
                    expect(res.status).to.equal(401);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        'Access denied,a valid access token is required',
                    );
                    done();
                });
        });

        it('It should throw error when access is not granted', (done) => {
            chai
                .request(app)
                .delete(`${fixtureBaseUrl}/${process.env.FIXTURE_ONE_ID}`)
                .set({
                    Authorization: `Bearer ${ process.env.USER_ONE_ACCESS_TOKEN}`,
                })
                .end((err, res) => {
                    const { message, status } = res.body;
                    expect(res.status).to.equal(403);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        'You required a higher access level to utilize this resource',
                    );
                    done();
                });
        });
        it('It should throw error when the fixture id is not found', (done) => {
            chai
              .request(app)
              .delete(`${fixtureBaseUrl}/621fc45b6b0445e7bf4d2999`)
              .set({
                Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
              })
              .end((err, res) => {
                const { message, status } = res.body;
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(message).to.equal(
                    'Fixture does not exist',
                );
                done();
              });
          });

        it('It successfully delete a fixture', (done) => {
            chai
                .request(app)
                .delete(`${fixtureBaseUrl}/${process.env.FIXTURE_ONE_ID}`)
                .set({
                    Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
                })
                .end((err, res) => {
                    const { message, status } = res.body;
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        'Successfully deleted fixture',
                    );
                    expect(status).to.equal('success');
                    done();
                });
        });

        it('It successfully add a team', (done) => {
            chai
                .request(app)
                .post(fixtureBaseUrl)
                .set({
                    Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
                })

                .send(createFixture)
                .end((err, res) => {
                    const { message, status, data } = res.body;
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(message).to.equal(
                        'Successfully created fixtures',
                    );
                    expect(status).to.equal('success');
                    expect(data).to.be.a('object');
                    process.env.FIXTURE_ONE_ID = res.body.data._id;
                    done();
                });
        });
    })

    describe('Edit team', () => {
        it('It should throw error when no token is provided', (done) => {
            chai
                .request(app)
                .put(`${fixtureBaseUrl}/${process.env.FIXTURE_ONE_ID}`)
                .send(createFixture)
                .end((err, res) => {
                    const { message, status } = res.body;
                    expect(res.status).to.equal(401);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        'Access denied,a valid access token is required',
                    );
                    
                    done();
                });
        });

        it('It should throw error when access is not granted', (done) => {
            chai
                .request(app)
                .put(`${fixtureBaseUrl}/${process.env.FIXTURE_ONE_ID}`)
                .set({
                    Authorization: `Bearer ${ process.env.USER_ONE_ACCESS_TOKEN}`,
                })

                .send(createFixture)
                .end((err, res) => {
                    const { message, status } = res.body;
                    expect(res.status).to.equal(403);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        'You required a higher access level to utilize this resource',
                    );
                   
                    done();
                });
        });

        it('It should throw error when the fixture id is not found', (done) => {
            chai
              .request(app)
              .put(`${fixtureBaseUrl}/621fc45b6b0445e7bf4d2999`)
              .set({
                Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
              })
              .send()
              .end((err, res) => {
                const { message, status } = res.body;
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(message).to.equal(
                  'Fixture does not exist',
                );
                done();
              });
          });


        it('It successfully edit a team', (done) => {
            chai
                .request(app)
                .put(`${fixtureBaseUrl}/${process.env.FIXTURE_ONE_ID}`)
                .set({
                    Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
                })

                .send(editFixture)
                .end((err, res) => {
                    const { message, status } = res.body;
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        'Successfully updated fixtures',
                    );
                    expect(status).to.equal('success');
                    done();
                });
        });

    })

    describe('fetch a single team', () => {
        it('It should throw error when no token is provided', (done) => {
            chai
                .request(app)
                .get(`${fixtureBaseUrl}/${process.env.FIXTURE_ONE_ID}`)
                .end((err, res) => {
                    const { message, status } = res.body;
                    expect(res.status).to.equal(401);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        'Access denied,a valid access token is required',
                    );
                    
                    done();
                });
        });


        it('It should throw error when the fixture id is not found', (done) => {
            chai
              .request(app)
              .get(`${fixtureBaseUrl}/621fc45b6b0445e7bf4d2999`)
              .set({
                Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
              })
              .end((err, res) => {
                const { message, status } = res.body;
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(message).to.equal(
                  'Fixture does not exist',
                );
                done();
              });
          });


        it('It successfully fetch a fixture', (done) => {
            chai
                .request(app)
                .get(`${fixtureBaseUrl}/${process.env.FIXTURE_ONE_ID}`)
                .set({
                    Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
                })
                .end((err, res) => {
                    const { message, status, data } = res.body;
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(message).to.equal(
                        'Successfully fetched fixture',
                    );
                    expect(status).to.equal('success');
                    expect(data).to.be.a('object');
                    done();
                });
        });

    })

    describe('fetch all team', () => {
        it('It should throw error when no token is provided', (done) => {
            chai
                .request(app)
                .get(`${fixtureBaseUrl}/${process.env.FIXTURE_ONE_ID}}`)
                .end((err, res) => {
                    const { message, status } = res.body;
                    expect(res.status).to.equal(401);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        'Access denied,a valid access token is required',
                    );
                    
                    done();
                });
        });


        it('It successfully fetch a fixture', (done) => {
            chai
                .request(app)
                .get(`${fixtureBaseUrl}/${process.env.FIXTURE_ONE_ID}`)
                .set({
                    Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
                })
                .end((err, res) => {
                    const { message, status, data } = res.body;
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(message).to.equal(
                        'Successfully fetched fixture',
                    );
                    expect(status).to.equal('success');
                    expect(data).to.be.a('object');
                    done();
                });
        });

    })


})
