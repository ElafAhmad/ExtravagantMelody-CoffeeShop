import * as yup from 'yup'; // A library for data type validation
import {
  ConvectorModel,  //Properties 
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class CoffeeGrainPortionBatch extends ConvectorModel<CoffeeGrainPortionBatch> { // Class that inherits from ConvectorModel class
  //
  public static async getByGrainBatchId(grainBatchId: string /* Batch ID is passed from the coffee controller */) { // A function that retrieves the amount of a consumed portion based on the batch ID 
    const portions = await CoffeeGrainPortionBatch.query(CoffeeGrainPortionBatch, { //Data is going to be retrieved form CouachDB
      selector: { grainBatchId }  // The query that is going to be passed (A mango query)
    }) as CoffeeGrainPortionBatch[]; // When grain portion is retrieved, it is stored as an array of type CoffeeGrainPortionBatch

    return portions;
  }

  @ReadOnly() // If a value was assigned on the ledger it cannot be assigned again
  @Required()
  public readonly type = 'com.covalentx.coffee-grain-batch-portion';

  @Required()
  @ReadOnly()
  @Validate(yup.string()) // grainBatchId is gonna be validated as a string
  // Grain batch reference
  public grainBatchId: string;

  @Required()
  @ReadOnly()
  @Validate(yup.string())
  // Toast batch reference
  public toastBatchId: string;

  @Required()
  @ReadOnly()
  @Validate(yup.number().min(0)) // weight is gonna be validated as a number with minimum value of 0
  public weight: number;
}
