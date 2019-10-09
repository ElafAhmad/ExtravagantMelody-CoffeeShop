import * as yup from 'yup';
import {
  ConvectorModel,
  Default,//to assign default values to the attributes
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';
//this is mainly used in coffee controller, to specify the owner of the coffee 
export class Participant extends ConvectorModel<Participant> {
  public static async getFromFingerpring(fingerprint: string) {// search for a participant using it's fingerprints
    const participants = await Participant.query(Participant, {//create a partocipant and assign a finger prints to it
      selector: {
        type: new Participant().type,
        identity: fingerprint
      }
    }) as Participant[]; // Add new participant to participants array

    if (!participants.length) {
      throw new Error(`No participant was found with fingerprint: ${fingerprint}`);
    }

    return participants[0];
  }


// the attributes(data) we want to save on the ledger. They added some validation to make sure it's the data we are expecting

  @ReadOnly()// Make sure that already assigned values to the ledger won't be assigned again 
  @Required()
  public readonly type = 'com.covalentx.participant';

  @Required()
  @Validate(yup.string())
  public name: string;

  @Required()
  @Validate(yup.string())
  public identity: string;
}
