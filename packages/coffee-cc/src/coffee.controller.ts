import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param,
  FlatConvectorModel
} from '@worldsibu/convector-core';

// import { Participant } from 'participant-cc';

// import { CoffeeGrainBatch } from './grain-batch.model';
import { CoffeeToastBatch } from './toast-batch.model';
// import { CoffeeGrainPortionBatch } from './grain-batch-portion.model';

@Controller('coffee')
export class CoffeeController extends ConvectorController<ChaincodeTx> {


  @Invokable()
  public async getToastBatch(//by the id
    @Param(yup.string())
    batchId: string
  ) {
    const batch = await CoffeeToastBatch.getOne(batchId);//Get the toast batch by its Id
    if (!batch.id) {
      throw new Error(`No batch found with id ${batchId}`);//throw err if not found
    }

    const composition: {
      [k: string]: {//to reduce the comostions into an array of string that contain {grain batch, prducers, participation percent}
        batch: CoffeeGrainBatch;
        prducers: Participant[];
        participation: number;
      }
    } = await batch.composition.reduce(async (result, portionId) => {
      const obj = await result;//get reduce result 
      const portion = await CoffeeGrainPortionBatch.getOne(portionId);//get the portion by its id
      const grainBatch = await CoffeeGrainBatch.getOneFull(portion.grainBatchId);//get the grain batch and the producers by the portionId
      const participation = portion.weight /batch.weigth;//the percent each producer produce in this comopsition

      return {...obj, [portionId]: {...grainBatch, participation}};//return the new compostion value
    }, Promise.resolve({}));

    return {
      batch: batch.toJSON() as CoffeeToastBatch,//write the batch into JSON
      composition//the new composition value  
    };
  }


  @Invokable()
  public async getAllToastBatches() {
    return (await CoffeeToastBatch.getAll()).map(p => p.toJSON() as CoffeeToastBatch);//get all the toast batches and map it into JSON
  }


}
