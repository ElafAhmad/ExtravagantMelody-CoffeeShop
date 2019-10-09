import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Participant } from './participant.model';

@Controller('participant') //explain how this convector going to be registered on chaincode
export class ParticipantController extends ConvectorController<ChaincodeTx> {
  @Invokable()//Used to expose function on chain code API 
  public async register(
    @Param(Participant)//Validate the data to make sure we have a correct participant 
    participant: Participant
  ) {//check if the participant registered or not? 
    const existing = await Participant.getOne(participant.id);
    if (existing.id) {
      throw new Error(`Participant with id ${participant.id} has been already registered`);
    }

    participant.identity = this.sender;//this.sender contain the fingerprints of the user invoking the, and we are comparing it with the already registered participant using fingerprints 
    await participant.save();//saving values to the ledger.
    this.tx.stub.setEvent('UserRegister', { participant });
  }

  @Invokable()
  public async get(
    @Param(yup.string())
    id: string
  ) {//checking producer, already registered or not? 
    const existing = await Participant.getOne(id);
    if (!existing.id) {
      throw new Error(`No producer was found with id ${id}`);
    }

    return existing.toJSON() as Participant;
  }

  @Invokable()
  public async getAll() {//get all participants of same type
    return (await Participant.getAll()).map(p => p.toJSON() as Participant);
  }
}
