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

  
  // @Invokable()
  // public async createToastBatch(
  //   @Param(CoffeeToastBatch)
  //   batch: CoffeeToastBatch,
  //   @Param(yup.array(CoffeeGrainPortionBatch.schema()))
  //   composition: FlatConvectorModel<CoffeeGrainPortionBatch>[]//get an array of GrainPortionBatch to tell us what is the copmosition of each toast batch 
  // ) {
  //   const existing = await CoffeeToastBatch.getOne(batch.id);
  //   if (existing.id) {//if there is already existiing toast batch with this id
  //     throw new Error(`Batch with id ${batch.id} has been already registered`);
  //   }

  //   let weigth = 0;//the new created toast batch will start with 0 weigth
  //   batch.composition = [];//the composition of the toast batch


  //   await Promise.all( composition.map(async portion => {//mapping into all the composition portions
      
  //     const grainBatch = await CoffeeGrainBatch.getOne(portion.grainBatchId);//get the grain batch dependeing on portion Id
  //     const consumedPortions = await CoffeeGrainPortionBatch.getByGrainBatchId(portion.grainBatchId);//get the all the consumed grain portions so we can make sure itsn't double spended
  //     const remainingPortion = grainBatch.weight - //the original weight
  //                                                 consumedPortions.reduce( //sum of the already consumedPortions weight
  //                                                                       (total, p) => total + p.weight, 0);//finally we get the remianing portion

  //     if (portion.weight > remainingPortion) {//*** validation to validate that the portion weight is available
  //       throw new Error(`Portion from batch ${portion.grainBatchId} exceeds the limits`);
  //     }

  //     const postionModel = new CoffeeGrainPortionBatch({
  //       ...portion,
  //       id: `${portion.grainBatchId}_${batch.id}`,//the id will be composed of the portionID_batchId
  //       toastBatchId: batch.id
  //     });

  //     batch.composition.push(postionModel.id);//push the postion into the toast batch
  //     weigth += portion.weight;//Let the total weight increased by each portion added
  //     await postionModel.save();//Then resolved 
  //   }));

  //   const creator = await Participant.getFromFingerpring(this.sender);//set the owner to the function sender  
    
  //   batch.weigth = weigth;//set the batch weight
  //   batch.prducer = creator.id;//set the batch producer to the one who create this toast batch
  //   batch.owner = creator.id;//set the batch owner to the one who create this toast batch

  //   await batch.save();//save the batch to the ledger
  // }


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