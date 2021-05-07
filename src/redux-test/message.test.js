import * as API from '../services/message';
import { call, put } from 'redux-saga/effects';
const messageModel = require('../models/message').default;
const { reducers, state, effects } = messageModel;

describe('message->test', () => {
  describe('messageModel->reducers', () => {
    test('common->test', () => {
      expect(
        reducers.common(
          { ...state },
          {
            type: 'common',
            payload: {
              messageTotal: 1,
            },
          },
        ),
      ).toEqual({ ...state, messageTotal: 1 });
    });
  });

  describe('messageModel->effects', () => {
    test('getMessageList->test', () => {
      const saga = effects.getMessageList;
      const actionCreator = {
        type: 'common',
        payload: {
          messageList: [],
          messageTotal: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getMessageList, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getMesDetail->test', () => {
      const saga = effects.getMesDetail;
      const actionCreator = {
        type: 'common',
        payload: {
          messageDetail: {},
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getMesDetail, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getAllUnreadMessage->test', () => {
      const saga = effects.getAllUnreadMessage;
      const actionCreator = {
        type: 'common',
        payload: {
          unreadMesNum: {},
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getAllUnreadMessage, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('batchReadMes->test', () => {
      const saga = effects.batchReadMes;
      const actionCreator = {
        type: 'common',
        payload: {},
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.batchReadMes, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('batchDeleteMes->test', () => {
      const saga = effects.batchDeleteMes;
      const actionCreator = {
        type: 'common',
        payload: {},
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.batchDeleteMes, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('deleteMes->test', () => {
      const saga = effects.deleteMes;
      const actionCreator = {
        type: 'common',
        payload: {},
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.deleteMes, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});
