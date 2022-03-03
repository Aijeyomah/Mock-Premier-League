import moment from 'moment';
import { Document, Model, model, Schema } from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';


interface ITeamMembers {
    name : string
    role: string;
    type: Array<1>
}
export interface ITeam extends Document {
    _id: string;
    teamName: string;
    teamMembers: ITeamMembers;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  
  }

const teamSchema =  new Schema({
  _id: Schema.Types.ObjectId,
  teamName: {
    type: String,
    unique: true,
    enum: ['AFC Bournemouth', 'Arsenal', 'Aston Villa', 'Brighton & Hove Albion', 'Burnley', 'Chelsea',
      'Crystal Palace', 'Everton', 'Leicester City', 'Liverpool', 'Manchester City', 'Manchester United',
      'Newcastle United', ' Norwich City', 'Sheffield United', 'Southampton', 'Tottenham Hotspur', 'Watford',
      'West Ham United', 'Wolverhampton Wanderers', 'Barcalona', 'wolves' ]
  },
  teamMembers: {
    name: {
      type: String, lowercase: true, required: true
    },
    role: {
      type: String,
      enum: ['Goal Keeper', 'Central Back', 'Central Midfield', 'Central Forward', 'Left Wing', 'Attacking Midfield', 'Central Forward', 'Left Midfielder', 'Striker', 'Defending', 'Right Midfielder'],
      required: true
    },
    type: Array
  },
  description: String,
  createdAt: { type: Date, default: moment(Date.now()).format('LLLL') },
  updatedAt: { type: Date, default: moment(Date.now()).format('LLLL') },
});

teamSchema.plugin(uniqueValidator);
/*
Define Our Indexes for quick queries and searches
*/
teamSchema.index({'teamMembers.0.name': 'text', description: 'text', _id: 'text'});

export const TeamModel: Model<ITeam> = model("Team", teamSchema);