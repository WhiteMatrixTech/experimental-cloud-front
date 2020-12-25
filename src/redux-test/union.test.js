import * as API from '../services/union';
import {call, put } from 'redux-saga/effects'

const unionModel = require('../models/union').default
const {reducers,state,effects} = unionModel


describe('union->test',()=>{
      describe('unionModel->reducers',() => {
            test('common->test',() => {
                  expect(reducers.common(
                    {...state},
                    {type:'common',payload:{
                          unionTotal: 1
                    }}
                  )).toEqual({...state,unionTotal: 1})
              })
      })

      describe('unionModel->effects',()=>{
            test('getUnionList->test',() => {
                const saga = effects.getUnionList
                const actionCreator = {
                type:'common',
                payload:{
                  unionList: [],
                 unionTotal: 0
                  }
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.getUnionList,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            }) 

            test('getOrgListOfUnion->test',() => {
                const saga = effects.getOrgListOfUnion
                const actionCreator = {
                type:'common',
                payload:{
                  orgListOfUnion: [],
                 orgTotalOfUnion: 0
                  }
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.getOrgListOfUnion,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            }) 
            test('getPeerListOfUnion->test',() => {
                const saga = effects.getPeerListOfUnion
                const actionCreator = {
                type:'common',
                payload:{
                  peerListOfUnion: [],
                 peerTotalOfUnion: 0
                  }
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.getPeerListOfUnion,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            }) 

            test('getContractListOfUnion->test',() => {
                const saga = effects.getContractListOfUnion
                const actionCreator = {
                type:'common',
                payload:{
                  contractListOfUnion: [],
                 contractTotalOfUnion: 0
                  }
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.getContractListOfUnion,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            }) 

            test('getContractSummaryOfUnion->test',() => {
                const saga = effects.getContractSummaryOfUnion
                const actionCreator = {
                type:'common',
                payload:{
                 contractInfoOfUnion:''
                  }
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.getContractSummaryOfUnion,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            }) 


      })
})