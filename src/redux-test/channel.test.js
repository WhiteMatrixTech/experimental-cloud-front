import * as API from '../services/channel';
import {call, put } from 'redux-saga/effects'

const channelModel = require('../models/channel').default
const {reducers,state,effects} = channelModel

describe('channel->test',()=>{
      describe('channelModel->reducers',() => {
          test('common->test',() => {
                expect(reducers.common(
                  {...state},
                  {type:'common',payload:{
                        transactionTotal: 1
                  }}
                )).toEqual({...state,transactionTotal: 1})
            })
      })

      describe('channelModel->effects',()=>{
        test('getTransactionTotalDocs->test',() => {
          const saga = effects.getTransactionTotalDocs
          const actionCreator = {
            type:'common',
            payload:{
              transactionTotal:0
                }
              }
          const generator = saga(actionCreator,{call,put})
          let next = generator.next()
          expect(next.value).toEqual(call(API.getTransactionTotalDocs,actionCreator.payload))
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
              transactionList:[]
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

        test('onSearch->test',() => {
            const saga = effects.onSearch
            const actionCreator = {
              type:'common',
              payload:{
                transactionTotal: 1,
                 transactionList: [],
               transactionDetail: {},
                 }
               }
            const generator = saga(actionCreator,{call,put})
            let next = generator.next()
            expect(next.value).toEqual(call(API.getTransactionDetail,actionCreator.payload))
            generator.next({
              statusCode : 'ok',
              result: {}
            })
          
            next = generator.next()      
            expect(next.done).toEqual(true)
          })

        test('getTransactionDetail->test',() => {
            const saga = effects.getTransactionDetail
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
              expect(next.value).toEqual(call(API.getTransactionDetail,actionCreator.payload))
              generator.next({
                statusCode : 'ok',
                result: 1
              })
            
              next = generator.next()      
              expect(next.done).toEqual(true)
          })


      })
})