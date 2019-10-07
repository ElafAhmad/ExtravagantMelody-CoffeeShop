import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class CoffeeToastBatch extends ConvectorModel<CoffeeToastBatch> {
  
  @ReadOnly()
  @Required()
  public readonly type = 'com.covalentx.coffee-toast-batch';//defining the type of this class as toast coffee

  @ReadOnly()
  @Required()
  @Validate(yup.array(yup.string()))//this variable must be an array of string 
  // Grain batch portion references
  public composition: string[];//the portions that will be in this toast batch 

  @Required()
  @Validate(yup.number().min(0))//the price must be a positive number 
  public price: number;


  @ReadOnly()
  @Required()
  @Validate(yup.number().min(0))//this weight must be a positive number 
  public weigth: number;


  @Required()
  @ReadOnly()
  @Validate(yup.string())
  // Participant reference
  public prducer: string;//the producer of the toast batch

  @ReadOnly()
  @Required()
  @Validate(yup.number().min(0))
  public created: number;//how many toast batch have been created


  @Required()
  @Validate(yup.string())
  // Participant reference
  public owner: string;// the owner of this new toast batch

}
