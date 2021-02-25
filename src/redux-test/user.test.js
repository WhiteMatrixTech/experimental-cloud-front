import * as API from '../services/user';
import { call, put } from 'redux-saga/effects';

const userModel = require('../models/user').default;
const { reducers, state, effects } = userModel;

describe('user->test', () => {
  describe('userModel->reducers', () => {
    test('common->test', () => {
      expect(
        reducers.common(
          { ...state },
          {
            type: 'common',
            payload: {
              loginInfo: 'ssy',
            },
          },
        ),
      ).toEqual({ ...state, loginInfo: 'ssy' });
    });
  });

  describe('userModel->effects', () => {
    test('register->test', () => {
      const saga = effects.register;
      const actionCreator = {
        type: 'common',
        payload: {
          cacheAccount: {},
          userAndRegister: '',
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.register, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: {},
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('login->test', () => {
      const saga = effects.login;
      const actionCreator = {
        type: 'common',
        payload: {
          userInfo: '',
          accessToken: '',
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.login, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: {},
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('loginout->test', () => {
      const saga = effects.loginout;
      const actionCreator = {
        type: 'common',
        payload: {},
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.loginout, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: true,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});
