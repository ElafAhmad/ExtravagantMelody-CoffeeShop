// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Coffee, CoffeeController } from '../src';

describe('Coffee', () => {
  let adapter: MockControllerAdapter;
  let coffeeCtrl: ConvectorControllerClient<CoffeeController>;
  
  before(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    coffeeCtrl = ClientFactory(CoffeeController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'CoffeeController',
        name: join(__dirname, '..')
      }
    ]);

    adapter.addUser('Test');
  });
  
  it('should create a default model', async () => {
    const modelSample = new Coffee({
      id: uuid(),
      name: 'Test',
      created: Date.now(),
      modified: Date.now()
    });

    await coffeeCtrl.$withUser('Test').create(modelSample);
  
    const justSavedModel = await adapter.getById<Coffee>(modelSample.id);
  
    expect(justSavedModel.id).to.exist;
  });
});