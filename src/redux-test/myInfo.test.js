import * as API from '../services/myInfo';
import {call, put } from 'redux-saga/effects'
const myInfoModel = require('../models/myInfo').default
const {reducers,state,effects} = myInfoModel

describe('myInfo->test',()=>{
      describe('myInfoModel->reducers',() => {
          test('common->test',() => {
                expect(reducers.common(
                  {...state},
                  {type:'common',payload:{
                        myLeague: 1
                  }}
                )).toEqual({...state,myLeague: 1})
            })
      })

      describe('myInfoModel->effects',()=>{
            test('getMyInfoDetail->test',() => {
                const saga = effects.getMyInfoDetail
                const actionCreator = {
                type:'common',
                payload:{
                  myLeague:''
                  }
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.getMyInfoDetail,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            })
      })
})