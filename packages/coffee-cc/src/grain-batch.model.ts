import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';
import { Participant } from 'participant-cc';

export enum CoffeeGrainQuality {
  PREMIUM = 'premium',
  STANDARD = 'standard'
}

export class CoffeeGrainBatch extends ConvectorModel<CoffeeGrainBatch> {
  public static async getOneFull(id: string) { // Returns the whole batch 
    const batch = await CoffeeGrainBatch.getOne(id); // Returns a single batch by its passed ID
    //Creates a Promise 
    const prducers = await Promise.all(batch.prducers.map(async id => Participant.getOne(id))); // map is gonna convert id to participant model that is retrieved from the DB

    return {
      batch: batch.toJSON() as CoffeeGrainBatch, 
      prducers: prducers.map(p => p.toJSON() as Participant)
    };
  }

  @ReadOnly()
  @Required()
  public readonly type = 'com.covalentx.coffee-grain-batch';

  @Required()
  @ReadOnly()
  @Validate(yup.string())
  public location: string;

  @Required()
  @ReadOnly()
  @Validate(yup.number().min(0))
  public height: number;

  @Required()
  @ReadOnly()
  @Validate(yup.string().oneOf(Object.keys(CoffeeGrainQuality).map(k => CoffeeGrainQuality[k]))) //Converting the enum to array
  public quality: CoffeeGrainQuality; // Whatever is assigned to this property is gonna be one of the array values

  @Required()
  @ReadOnly()
  @Validate(yup.number().min(0))
  public weight: number;

  @Required()
  @Validate(yup.number().min(0))
  public price: number;

  @Required()
  @ReadOnly()
  @Validate(yup.array(yup.string()))
  // Participant reference
  public prducers: string[];  // registered participants

  @ReadOnly()
  @Required()
  @Validate(yup.number().min(0))
  public created: number;  // Creation date

  @Required()
  @Validate(yup.string())
  // Participant reference
  public owner: string; 
}
