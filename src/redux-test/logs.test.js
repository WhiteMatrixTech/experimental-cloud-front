import * as API from '../services/logs';
import {call, put } from 'redux-saga/effects'
const logModel = require('../models/logs').default
const {reducers,state,effects} = logModel


describe('log->test',()=>{
      describe('logModel->reducers',() => {
          test('common->test',() => {
                expect(reducers.common(
                  {...state},
                  {type:'common',payload:{
                        logsTotal: 1
                  }}
                )).toEqual({...state,logsTotal: 1})
            })
      })

      describe('logModel->effects',()=>{
          test('getLogsList->test',() => {
                const saga = effects.getLogsList
                const actionCreator = {
                type:'common',
                payload:{
                  logsList:[],
                 logsTotal: 0
                  }
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.getLogsList,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            })
      })
})