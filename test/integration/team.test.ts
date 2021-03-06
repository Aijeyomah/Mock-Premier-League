import chai from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';

import app from '../../src/index';
import { createTeam, editTeamData } from './dummy.data';

const teamBaseUrl = '/api/v1/teams';

const { expect } = chai;
chai.use(chaiHttp)

describe('Team Tests', () => {
    describe('Add team', () => {
        it('It should throw error when no token is provided', (done) => {
            chai
                .request(app)
                .post(teamBaseUrl)
                .send(createTeam)
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
                .post(teamBaseUrl)
                .set({
                    Authorization: `Bearer ${ process.env.USER_ONE_ACCESS_TOKEN}`,
                })
                .send(createTeam)
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
        it('It should throw error when payload is incomplete', (done) => {
            chai
                .request(app)
                .post(teamBaseUrl)
                .set({
                    Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
                })
                .send({})
                .end((err, res) => {
                    const { message, status } = res.body;
                    expect(res.status).to.equal(400);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        '"teamName" is required',
                    );
                    done();
                });
        });

        it('It successfully add a team', (done) => {
            chai
                .request(app)
                .post(teamBaseUrl)
                .set({
                    Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
                })

                .send(createTeam)
                .end((err, res) => {
                    console.log(res.body.message)
                    const { message, status, data } = res.body;
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(message).to.equal(
                        'Team added successfully',
                    );
                    expect(status).to.equal('success');
                    expect(data).to.be.a('object');
                    expect(data.teamName).to.equal(createTeam.teamName);
                    process.env.TEAM_ONE_ID = res.body.data._id;
                    done();
                });
        });

    })

    describe('delete team', () => {
        it('It should throw error when no token is provided', (done) => {
            chai
                .request(app)
                .delete(`${teamBaseUrl}/${process.env.TEAM_ONE_ID}`)
                .send(createTeam)
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
                .delete(`${teamBaseUrl}/${process.env.TEAM_ONE_ID}`)
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
        it('It should throw error when the team id is not found', (done) => {
            chai
              .request(app)
              .delete(`${teamBaseUrl}/621fc45b6b0445e7bf4d2999`)
              .set({
                Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
              })
              .end((err, res) => {
                const { message, status } = res.body;
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(message).to.equal(
                  'Team does not exist',
                );
                done();
              });
          });

        it('It successfully delete a team', (done) => {
            chai
                .request(app)
                .delete(`${teamBaseUrl}/${process.env.TEAM_ONE_ID}`)
                .set({
                    Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
                })

                .send(createTeam)
                .end((err, res) => {
                    const { message, status, data } = res.body;
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        'Successfully removed team',
                    );
                    expect(status).to.equal('success');
                    done();
                });
        });

        it('It successfully add a team', (done) => {
            chai
                .request(app)
                .post(teamBaseUrl)
                .set({
                    Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
                })

                .send(createTeam)
                .end((err, res) => {
                    const { message, status, data } = res.body;
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(message).to.equal(
                        'Team added successfully',
                    );
                    expect(status).to.equal('success');
                    expect(data).to.be.a('object');
                    expect(data.teamName).to.equal(createTeam.teamName);
                    process.env.TEAM_ONE_ID = res.body.data._id;
                    done();
                });
        });

    })

    describe('Edit team', () => {
        it('It should throw error when no token is provided', (done) => {
            chai
                .request(app)
                .put(`${teamBaseUrl}/${process.env.TEAM_ONE_ID}`)
                .send(createTeam)
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
                .put(`${teamBaseUrl}/${process.env.TEAM_ONE_ID}`)
                .set({
                    Authorization: `Bearer ${ process.env.USER_ONE_ACCESS_TOKEN}`,
                })

                .send(createTeam)
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

        it('It should throw error when the team id is not found', (done) => {
            chai
              .request(app)
              .put(`${teamBaseUrl}/621fc45b6b0445e7bf4d2999`)
              .set({
                Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
              })
              .send(editTeamData)
              .end((err, res) => {
                const { message, status } = res.body;
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(message).to.equal(
                  'Team does not exist',
                );
                done();
              });
          });


        it('It successfully edit a team', (done) => {
            chai
                .request(app)
                .put(`${teamBaseUrl}/${process.env.TEAM_ONE_ID}`)
                .set({
                    Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
                })

                .send(editTeamData)
                .end((err, res) => {
                    const { message, status, data } = res.body;
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('status');
                    expect(message).to.equal(
                        'Successfully updated team',
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
                .get(`${teamBaseUrl}/${process.env.TEAM_ONE_ID}`)
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


        it('It should throw error when the team id is not found', (done) => {
            chai
              .request(app)
              .get(`${teamBaseUrl}/621fc45b6b0445e7bf4d2999`)
              .set({
                Authorization: `Bearer ${process.env.ADMIN_ONE_ACCESS_TOKEN}`,
              })
              .end((err, res) => {
                const { message, status } = res.body;
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(message).to.equal(
                  'Team does not exist',
                );
                done();
              });
          });


        it('It successfully fetch a team', (done) => {
            chai
                .request(app)
                .get(`${teamBaseUrl}/${process.env.TEAM_ONE_ID}`)
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
                        'Successfully fetched team',
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
                .get(`${teamBaseUrl}/all`)
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


        it('It successfully fetch all team', (done) => {
            chai
                .request(app)
                .get(`${teamBaseUrl}/all`)
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
                        'Successfully fetched all teams',
                    );
                    expect(status).to.equal('success');
                    expect(data).to.be.a('object');
                    done();
                });
        });

    })


})
