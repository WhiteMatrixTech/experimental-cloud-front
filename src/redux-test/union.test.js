import * as API from '../services/channel';
import { call, put } from 'redux-saga/effects';

const channelModel = require('../models/channel').default;
const { reducers, state, effects } = channelModel;

describe('channel->test', () => {
  describe('channelModel->reducers', () => {
    test('common->test', () => {
      expect(
        reducers.common(
          { ...state },
          {
            type: 'common',
            payload: {
              channelTotal: 1,
            },
          },
        ),
      ).toEqual({ ...state, channelTotal: 1 });
    });
  });

  describe('channelModel->effects', () => {
    test('getChannelList->test', () => {
      const saga = effects.getChannelList;
      const actionCreator = {
        type: 'common',
        payload: {
          channelList: [],
          channelTotal: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getChannelList, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getOrgListOfChannel->test', () => {
      const saga = effects.getOrgListOfChannel;
      const actionCreator = {
        type: 'common',
        payload: {
          orgListOfChannel: [],
          orgTotalOfChannel: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getOrgListOfChannel, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });
    test('getNodeListOfChannel->test', () => {
      const saga = effects.getNodeListOfChannel;
      const actionCreator = {
        type: 'common',
        payload: {
          nodeListOfChannel: [],
          nodeTotalOfChannel: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getNodeListOfChannel, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getContractListOfChannel->test', () => {
      const saga = effects.getContractListOfChannel;
      const actionCreator = {
        type: 'common',
        payload: {
          contractListOfChannel: [],
          contractTotalOfChannel: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getContractListOfChannel, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getContractSummaryOfChannel->test', () => {
      const saga = effects.getContractSummaryOfChannel;
      const actionCreator = {
        type: 'common',
        payload: {
          contractInfoOfChannel: '',
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getContractSummaryOfChannel, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});
