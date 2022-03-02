import moment from 'moment';
import { Document, Model, model, Schema } from "mongoose";


/**
 * Interface to model the Team Schema for TypeScript.
 */
 export interface IFixture extends Document {
    firstTeam: [];
    secondTeam: string;
    status: string;
    matchInfo: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  
  }

const team = {
  ref: 'TeamModel',
  type: Array,
  name: {
    type: String,
    enum: ['AFC Bournemouth', 'Arsenal', 'Aston Villa', 'Brighton & Hove Albion', 'Burnley', 'Chelsea',
      'Crystal Palace', 'Everton', 'Leicester City', 'Liverpool', 'Manchester City', 'Manchester United',
      'Newcastle United', ' Norwich City', 'Sheffield United', 'Southampton', 'Tottenham Hotspur', 'Watford',
      'West Ham United', 'Wolverhampton Wanderers']
  },
  score: { type: Number, default: 0 }
};

const teamFixtureSchema : Schema =  new Schema({
  _id: Schema.Types.ObjectId,
  firstTeam: team,
  secondTeam: team,
  status: { type: String, default: 'pending' },
  matchInfo: {
    type: Array,
    date: Date,
    stadium: {
      type: String,
      enum: ['Vitality Stadium', 'The Amex', 'Turf Moor', 'Cardiff City Stadium',
        "John Smith's Stadium", 'King Power Stadium', 'Goodison Park', 'Anfield',
        'Emirates Stadium', 'Stamford Bridge', 'Selhurst Park', 'Craven Cottage',
        'Wembley Stadium', 'London Stadium', 'Etihad Stadium', 'Old Trafford',
        'St James Park', "St Mary's Stadium", 'Vicarage Road', 'Molineux Stadium']
    }
  },
  createdAt: { type: Date, default: moment(Date.now()).format('LLLL') },
  updatedAt: { type: Date, default: moment(Date.now()).format('LLLL') },
});

export const FixtureModel: Model<IFixture> = model("Fixtures", teamFixtureSchema);