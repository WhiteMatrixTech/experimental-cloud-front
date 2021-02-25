import * as API from '../services/peer';
import { call, put } from 'redux-saga/effects';

const peerModel = require('../models/peer').default;
const { reducers, state, effects } = peerModel;

describe('peer->test', () => {
  describe('peerModel->reducers', () => {
    test('common->test', () => {
      expect(
        reducers.common(
          { ...state },
          {
            type: 'common',
            payload: {
              nodeTotal: 1,
            },
          },
        ),
      ).toEqual({ ...state, nodeTotal: 1 });
    });
  });

  describe('peerModel->effects', () => {
    test('getOrgList->test', () => {
      const saga = effects.getOrgList;
      const actionCreator = {
        type: 'common',
        payload: {
          orgList: [],
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getOrgList, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getNodeList->test', () => {
      const saga = effects.getNodeList;
      const actionCreator = {
        type: 'common',
        payload: {
          nodeList: [],
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getNodeList, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getPeerTotalDocs->test', () => {
      const saga = effects.getPeerTotalDocs;
      const actionCreator = {
        type: 'common',
        payload: {
          nodeTotal: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getPeerTotalDocs, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('createNode->test', () => {
      const saga = effects.createNode;
      const actionCreator = {
        type: 'common',
        payload: {},
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.createNode, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});
