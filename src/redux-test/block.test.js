import * as API from '../services/block';
import {call, put } from 'redux-saga/effects'

const blockModel = require('../models/block').default
const{reducers,state,effects} = blockModel



describe('block->test',()=>{
      describe('blockModel->reducers',()=>{
        test('common->test',() => {
            expect(reducers.common(
              {...state},
              {type:'common',payload:{
                    transactionTotal: 1
              }}
            )).toEqual({...state,transactionTotal: 1})
        })
      })

      describe('blockModel->effects',() => {
        test('getBlockTotalDocs->test',() => {
        //const {call,put} = effects
          const saga = effects.getBlockTotalDocs
          const actionCreator = {
          type:'common',
          payload:{
            blockTotal:0
            }
        }
          const generator = saga(actionCreator,{call,put})
          let next = generator.next()
          expect(next.value).toEqual(call(API.getBlockTotalDocs,actionCreator.payload))
          generator.next({
            statusCode : 'ok',
            data: 9
            })
          next = generator.next()      
          expect(next.done).toEqual(true)
      })

        test('getBlockList->test',() => {
          const saga = effects.getBlockList
          const actionCreator = {
            type:'common',
              payload:{
              blockList:[]
            }
        }
          const generator = saga(actionCreator,{call,put})
          let next = generator.next()
          expect(next.value).toEqual(call(API.getBlockList,actionCreator.payload))
          generator.next({result:{
            statusCode : 'ok',
            items: []
          }})
          next = generator.next()      
          expect(next.done).toEqual(true)
      })

        test('onSearch->test',() => {
        const saga = effects.onSearch
        const actionCreator = {
          type:'common',
          payload:{
            blockTotal: 1,
            blockList: [],
            blockDetail:{},
            }
        }
          const generator = saga(actionCreator,{call,put})
          let next = generator.next()
          expect(next.value).toEqual(call(API.getBlockDetail,actionCreator.payload))
          generator.next({
            statusCode : 'ok',
            result: {}
          })
        
          next = generator.next()      
          expect(next.done).toEqual(true)
      })
        test('getTxCountByBlockHash->test',() => {
        const saga = effects.getTxCountByBlockHash
        const actionCreator = {
          type:'common',
          payload:{
            transactionTotal: 0
            }
        }
          const generator = saga(actionCreator,{call,put})
          let next = generator.next()
          expect(next.value).toEqual(call(API.getTxCountByBlockHash,actionCreator.payload))
          generator.next({
            statusCode : 'ok',
            result: 1
          })
        
          next = generator.next()      
          expect(next.done).toEqual(true)
      })
        test('getBlockDetail->test',() => {
        const saga = effects.getBlockDetail
        const actionCreator = {
          type:'common',
          payload:{
            blockTotal: 1,
            blockList: [],
            blockDetail: '',
            }
        }
          const generator = saga(actionCreator,{call,put})
          let next = generator.next()
          expect(next.value).toEqual(call(API.getBlockDetail,actionCreator.payload))
          generator.next({
            statusCode : 'ok',
            result: 1
          })
        
          next = generator.next()      
          expect(next.done).toEqual(true)
      })
      
      test('getTransactionList->test',() => {
        const saga = effects.getTransactionList
        const actionCreator = {
          type:'common',
          payload:{
            transactionList: [],
            }
        }
          const generator = saga(actionCreator,{call,put})
          let next = generator.next()
          expect(next.value).toEqual(call(API.getTransactionList,actionCreator.payload))
          generator.next({
            statusCode : 'ok',
            result: 1
          })
        
          next = generator.next()      
          expect(next.done).toEqual(true)
      })

      })
})