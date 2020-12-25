import * as API from '../services/organization';
import {call, put } from 'redux-saga/effects'

const organizationModel = require('../models/organization').default
const {reducers,state,effects} = organizationModel


describe('organization->test',()=>{
      describe('organizationModel->reducers',() => {
          test('common->test',() => {
                expect(reducers.common(
                  {...state},
                  {type:'common',payload:{
                        orgTotal: 1
                  }}
                )).toEqual({...state,orgTotal: 1})
            })
      })
      describe('organizationModel->effects',()=>{
          test('getOrgList->test',() => {
                  const saga = effects.getOrgList
                  const actionCreator = {
                  type:'common',
                  payload:{
                    orgList:[]
                    }
                }
                  const generator = saga(actionCreator,{call,put})
                  let next = generator.next()
                  expect(next.value).toEqual(call(API.getOrgList,actionCreator.payload))
                  generator.next({
                    statusCode : 'ok',
                    result: 9
                    })
                  next = generator.next()      
                  expect(next.done).toEqual(true)
              })

          test('getOrgTotalDocs->test',() => {
                  const saga = effects.getOrgTotalDocs
                  const actionCreator = {
                  type:'common',
                  payload:{
                    orgTotal:0
                    }
                }
                  const generator = saga(actionCreator,{call,put})
                  let next = generator.next()
                  expect(next.value).toEqual(call(API.getOrgTotalDocs,actionCreator.payload))
                  generator.next({
                    statusCode : 'ok',
                    result: 9
                    })
                  next = generator.next()      
                  expect(next.done).toEqual(true)
              })

      })
})