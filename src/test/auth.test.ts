import chai from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';
import path from 'path';

import app from '../index';
import { incompleteUser1, user } from './dummy.data';

const signupRoute = 'http://localhost:3500/api/v1/auth/signup'

const { expect } = chai;
chai.use(chaiHttp)

describe('Auth Tests', () => {

    describe('User Sign up', () => {
        it('It should throw an error when a required field is not present', (done) => {
            chai.request(app)
            .post(signupRoute)
            .send(incompleteUser1)
              .set('Content-Type', 'application/json')
              .end((err, res) => {
                const { message, status } = res.body;
                //expect(res.statusCode).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(message).to.equal('');
                expect(status).to.equal('error');
                done();
            });
        })

        it('It should successfully signup a user', (done) => {
            chai.request(app)
            .post(signupRoute)
            .send(user)
              .set('Content-Type', 'application/json')
              .end((err, res) => {
                const { message, status, data} = res.body;
                //expect(res.statusCode).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(message).to.equal('An OTP has been sent to your phone number for verification');
                expect(status).to.equal('success');
                //expect(data.signup_role).to.equal('self_invited');
                expect(data.signup_role).to.equal(`${process.env.FICLUB_USER_ONE_SIGNUP_ROLE}`);
                expect(data).to.have.property('user_id');
                expect(data).to.have.property('accessToken');
                process.env.PREMIER_USER_EMAIL = res.body.data.phone_number;
                process.env.PREMIER_USER_ONE_ROLE = res.body.data.role;
                process.env.PREMIER_USER_ONE_ACCESS_TOKEN = res.body.data.accessToken;
                done();
            });
        })


        it('It should throw an error when user already exist', (done) => {
            chai.request(app)
            .post(signupRoute)
            .send(user)
              .set('Content-Type', 'application/json')
              .end((err, res) => {
                const { message, status } = res.body;
                //expect(res.statusCode).to.equal(400);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(message).to.equal('');
                expect(status).to.equal('error');
                done();
            });
        })
})


describe('User Login', () => {
    it('It should throw an error when fields are incomplete', (done) => {
        chai.request(app)
        .post(signupRoute)
        .send(incompleteUser1)
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            const { message, status } = res.body;
            //expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('status');
            expect(message).to.equal('Email address is required');
            expect(status).to.equal('error');
            done();
        });
    })

    it('It should throw an error for an invalid login credentials', (done) => {
        chai.request(app)
        .post(signupRoute)
        .send(incompleteUser1)
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            const { message, status } = res.body;
            //expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('status');
            expect(message).to.equal('Email address is required');
            expect(status).to.equal('error');
            done();
        });
    })

    it('It should successfully login a user', (done) => {
        chai.request(app)
        .post(signupRoute)
        .send(user)
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            const { message, status, data} = res.body;
            //expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('status');
            expect(message).to.equal('login successful');
            expect(status).to.equal('success');
            //expect(data.signup_role).to.equal('self_invited');
            expect(data.signup_role).to.equal(`${process.env.FICLUB_USER_ONE_SIGNUP_ROLE}`);
            //expect(data).to.have.property('user_id');
            expect(data).to.have.property('accessToken');
            process.env.PREMIER_USER_EMAIL = res.body.data.email;
            process.env.PREMIER_USER_ONE_ROLE = res.body.data.role;
            process.env.PREMIER_USER_ONE_ACCESS_TOKEN = res.body.data.accessToken;
            done();
        });
    })


    it('It should throw an error when user does not exist', (done) => {
        chai.request(app)
        .post(signupRoute)
        .send(user)
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            const { message, status } = res.body;
            //expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('status');
            expect(message).to.equal('');
            expect(status).to.equal('error');
            done();
        });
    })
})

})