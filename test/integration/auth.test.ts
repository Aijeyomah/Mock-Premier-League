import chai from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';

import app from '../../src/index';
import { incompleteUser1, user, admin, adminLoginData, userLoginData, invalidUserLoginData, invalidLoginData } from './dummy.data';

const signupRoute = '/api/v1/auth/signup';
const loginRoute = '/api/v1/auth/login'

const { expect } = chai;
chai.use(chaiHttp)

describe('Auth Tests', () => {

//     describe('User Sign up', () => {
//         // it('It should throw an error when a required field is not present', (done) => {
//         //     chai.request(app)
//         //     .post(signupRoute)
//         //     .send(incompleteUser1)
//         //       .set('Content-Type', 'application/json')
//         //       .end((err, res) => {
//         //         const { message, status } = res.body;
//         //         //expect(res.statusCode).to.equal(400);
//         //         expect(res.body).to.have.property('message');
//         //         expect(res.body).to.have.property('status');
//         //         expect(message).to.equal('firstName field is required');
//         //         expect(status).to.equal('error');
//         //         done();
//         //     });
            
//         // })

//         it('It should successfully signup an admin', (done) => {
//             chai.request(app)
//             .post(signupRoute)
//             .send(admin)
//             .set('Content-Type', 'application/json')
//             .end((err, res) => {
//               const { message, status, data} = res.body;
//               expect(res.body).to.have.property('message');
//               expect(res.body).to.have.property('status');
//               expect(message).to.equal('Successfully registered user');
//               process.env.USER_ONE_ROLE = res.body.data.role;
//               process.env.USER_ONE_ACCESS_TOKEN = res.body.data.token;
//               done();
//           });
//       })

//         it('It should successfully signup user', (done) => {
//           chai.request(app)
//           .post(signupRoute)
//           .send(user)
//             .set('Content-Type', 'application/json')
//             .end((err, res) => {
//               const { message, status, data} = res.body;
//               expect(res.body).to.have.property('message');
//               expect(res.body).to.have.property('status');
//               expect(message).to.equal('Successfully registered user');
//               process.env.USER_ONE_ROLE = res.body.data.role;
//               process.env.USER_ONE_ACCESS_TOKEN = res.body.data.token;
//               done();
//           });
//       })


//         it('It should throw an error when user already exist', (done) => {
//             chai.request(app)
//             .post(signupRoute)
//             .send(user)
//               .set('Content-Type', 'application/json')
//               .end((err, res) => {
//                 const { message, status } = res.body;
//                 expect(res.status).to.equal(409);
//                 expect(res.body).to.have.property('message');
//                 expect(res.body).to.have.property('status');
//                 expect(message).to.equal('A user with your email already exists');
//                 done();
//             });
//         })
// })


describe('User Login', () => {

    it('It should throw an error for an invalid login credentials', (done) => {
        chai.request(app)
        .post(loginRoute)
        .send(invalidUserLoginData)
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            const { message, status } = res.body;
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('status');
            expect(message).to.equal('Invalid email/password');
            done();
        });
    })

    it('It should successfully login a user', (done) => {
        chai.request(app)
        .post(loginRoute)
        .send(userLoginData)
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            const { message, status, data} = res.body;
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('status');
            expect(message).to.equal('login successful');
            expect(status).to.equal('success');
            expect(data).to.have.property('token');
            process.env.USER_ONE_ROLE = res.body.data.role;
            process.env.USER_ONE_ACCESS_TOKEN = res.body.data.token;
            done();
        });
    })

    it('It should successfully login an admin', (done) => {
      chai.request(app)
      .post(loginRoute)
      .send(adminLoginData)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          const { message, status, data} = res.body;
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('status');
          expect(message).to.equal('login successful');
          expect(status).to.equal('success');
          expect(data).to.have.property('token');
          process.env.ADMIN_ONE_ROLE = res.body.data.role;
          process.env.ADMIN_ONE_ACCESS_TOKEN = res.body.data.token;
          done();
      });
  })


    it('It should throw an error when admin provide invalid email', (done) => {
        chai.request(app)
        .post(loginRoute)
        .send(invalidLoginData)
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            const { message, status } = res.body;
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('status');
            expect(message).to.equal('Invalid email/password')
            expect(status).to.equal(400);
            done();
        });
    })
})

})