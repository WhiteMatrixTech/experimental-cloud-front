import * as API from '../services/contract';
import { call, put } from 'redux-saga/effects';

const contractModel = require('../models/contract').default;
const { reducers, state, effects } = contractModel;
describe('contract->test', () => {
  describe('contractModel->reducers', () => {
    test('common->test', () => {
      expect(
        reducers.common(
          { ...state },
          {
            type: 'common',
            payload: {
              myContractTotal: 1,
            },
          },
        ),
      ).toEqual({ ...state, myContractTotal: 1 });
    });
  });

  describe('contractModel->effects', () => {
    test('getPageListOfChainCode->test', () => {
      const saga = effects.getPageListOfChainCode;
      const actionCreator = {
        type: 'common',
        payload: {
          myContractList: [],
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getPageListOfChainCode, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getPageTotalDocsOfChainCode->test', () => {
      const saga = effects.getPageTotalDocsOfChainCode;
      const actionCreator = {
        type: 'common',
        payload: {
          myContractTotal: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getPageTotalDocsOfChainCode, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        data: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getDetailOfChainCode->test', () => {
      const saga = effects.getDetailOfChainCode;
      const actionCreator = {
        type: 'common',
        payload: {
          curContractDetail: {},
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getDetailOfChainCode, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        data: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getChainCodeHistory->test', () => {
      const saga = effects.getChainCodeHistory;
      const actionCreator = {
        type: 'common',
        payload: {
          curContractVersionList: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getChainCodeHistory, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getChainCodeHistoryTotalDocs->test', () => {
      const saga = effects.getChainCodeHistoryTotalDocs;
      const actionCreator = {
        type: 'common',
        payload: {
          curContractVersionTotal: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getChainCodeHistoryTotalDocs, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getChainCodeApprovalHistory->test', () => {
      const saga = effects.getChainCodeApprovalHistory;
      const actionCreator = {
        type: 'common',
        payload: {
          curVersionApprovalList: [],
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getChainCodeApprovalHistory, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getChainCodeApprovalHistoryTotalDocs->test', () => {
      const saga = effects.getChainCodeApprovalHistoryTotalDocs;
      const actionCreator = {
        type: 'common',
        payload: {
          curVersionApprovalTotal: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getChainCodeApprovalHistoryTotalDocs, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getPageListOPrivacyStrategy->test', () => {
      const saga = effects.getPageListOPrivacyStrategy;
      const actionCreator = {
        type: 'common',
        payload: {
          strategyList: [],
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getPageListOPrivacyStrategy, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getPrivacyStrategyTotalDocs->test', () => {
      const saga = effects.getPrivacyStrategyTotalDocs;
      const actionCreator = {
        type: 'common',
        payload: {
          strategyTotal: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getPrivacyStrategyTotalDocs, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getPageListOfRoleMember->test', () => {
      const saga = effects.getPageListOfRoleMember;
      const actionCreator = {
        type: 'common',
        payload: {
          strategyMemberList: [],
          leagueName: '',
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getPageListOfRoleMember, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('updateStrategyMember->test', () => {
      const saga = effects.updateStrategyMember;
      const actionCreator = {
        type: 'common',
        payload: {},
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.updateStrategyMember, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        data: true,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getPageListOfRecord->test', () => {
      const saga = effects.getPageListOfRecord;
      const actionCreator = {
        type: 'common',
        payload: {
          protectRecordList: [],
          protectRecordTotal: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getPageListOfRecord, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: { strategyMember: 'ssy' },
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getRepositoryListOfChainCode->test', () => {
      const saga = effects.getRepositoryListOfChainCode;
      const actionCreator = {
        type: 'common',
        payload: {
          repositoryList: [],
          repositoryTotal: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getRepositoryListOfChainCode, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getStoreSupplyListOfChainCode->test', () => {
      const saga = effects.getStoreSupplyListOfChainCode;
      const actionCreator = {
        type: 'common',
        payload: {
          repositoryDetailList: [],
          repositoryDetailTotal: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getStoreSupplyListOfChainCode, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });

    test('getStoreSupplyExplainListOfChainCode->test', () => {
      const saga = effects.getStoreSupplyExplainListOfChainCode;
      const actionCreator = {
        type: 'common',
        payload: {
          fieldDescList: [],
          fieldDescTotal: 0,
        },
      };
      const generator = saga(actionCreator, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(API.getStoreSupplyExplainListOfChainCode, actionCreator.payload));
      generator.next({
        statusCode: 'ok',
        result: 9,
      });
      next = generator.next();
      expect(next.done).toEqual(true);
    });
  });
});
