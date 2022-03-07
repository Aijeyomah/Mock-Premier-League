import { redisDB } from 'db/setup/redis';
import moment from 'moment'
import { Helper, genericErrors } from 'utils';

const { errorResponse } = Helper;

export const rateLimiter = async(req,res,next) => {
  const reply = await redisDB.exists(req.user)
  
  if(reply === 1) {

    const  result  = await redisDB.get(req.user)
        let data = JSON.parse(result)
        let currentTime = moment().unix()
        let difference = (currentTime - data.startTime)/60
        if(difference >= 1) {
          let body = {
            'count': 1,
            'startTime': moment().unix()
          }
          redisDB.set(req.headers.user,JSON.stringify(body))
          // allow the request
         return next()
        }
        if(difference < 1) {
          if(data.count > 3) {
            return errorResponse(req, res, genericErrors.throttleError);
          }
          // update the count and allow the request
          data.count++
          redisDB.set(req.headers.user,JSON.stringify(data))
          // allow request
          next()
    }  }else {
      // add new user
      let body = {
        'count': 1,
        'startTime': moment().unix()
      }
      redisDB.set(req.headers.user,JSON.stringify(body))
      // allow request
      next()
   
  }
}
