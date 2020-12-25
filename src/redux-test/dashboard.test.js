import { getBlockList } from '../services/block.js';
import { getTransactionList } from '../services/channel.js';
import {call, put } from 'redux-saga/effects'
const dashboardModel = require('../models/dashboard').default
const {reducers,state,effects} = dashboardModel

describe('dashboard->test',()=>{
      describe('dashboardModel->reducers',() => {
          test('common->test',() => {
                expect(reducers.common(
                  {...state},
                  {type:'common',payload:{
                        transactionList: [{txTd:1}]
                  }}
                )).toEqual({...state,transactionList: [{txTd:1}]})
            })
      })

      describe('dashboardModel->effects',()=>{
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
                expect(next.value).toEqual(call(getBlockList,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
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
                expect(next.value).toEqual(call(getTransactionList,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            })

      })
})