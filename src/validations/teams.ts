import { textSchema } from './generic';
import Joi from '@hapi/joi';


const validField = ['Goal Keeper', 'Central Back', 'Central Midfield', 'Central Forward', 'Left Wing', 'Attacking Midfield', 'Central Forward', 'Left Midfielder', 'Striker', 'Defending', 'Right Midfielder']
const validTeamNames = ['AFC Bournemouth', 'Arsenal', 'Aston Villa', 'Brighton & Hove Albion', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Leicester City', 'Liverpool', 'Manchester City', 'Manchester United',
  'Newcastle United', ' Norwich City', 'Sheffield United', 'Southampton', 'Tottenham Hotspur', 'Watford', 'West Ham United', 'Wolverhampton Wanderers', 'wolves']

  const teamMembersArray = Joi.object({
  name: textSchema(Joi, "role", 100, 2),
  role:  Joi.string()
  .trim()
  .valid(...validField)
  .required(),
});


export const addTeamSchema = Joi.object({
  teamName: Joi.string()
    .trim()
    .valid(...validTeamNames)
    .required(),
  teamMembers: Joi.array()
    .unique((a, b) => a.name === b.name)
    .items(teamMembersArray)
    .min(1)
    .required()
    .messages({
      'any.required': 'team members  is a required field',
      'string.empty': 'team members cannot be left empty',
      'array.min': 'team members must contain at least 2 items',
      'array.unique': 'team members can not contain duplicate name'
    }),
}).options({
      allowUnknown: true,
    });

    export const idParam = Joi.object().keys({
      teamId: Joi.string()
        .required(),
    });


    