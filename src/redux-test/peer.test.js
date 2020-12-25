import * as API from '../services/peer';
import {call, put } from 'redux-saga/effects'

const peerModel = require('../models/peer').default
const {reducers,state,effects} = peerModel


describe('peer->test',()=>{
      describe('peerModel->reducers',() => {
          test('common->test',() => {
                expect(reducers.common(
                  {...state},
                  {type:'common',payload:{
                        peerTotal: 1
                  }}
                )).toEqual({...state,peerTotal: 1})
            })
      })

      describe('peerModel->effects',()=>{
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

            test('getPeerList->test',() => {
                const saga = effects.getPeerList
                const actionCreator = {
                type:'common',
                payload:{
                  peerList:[]
                  }
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.getPeerList,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            })

            test('getPeerTotalDocs->test',() => {
                const saga = effects.getPeerTotalDocs
                const actionCreator = {
                type:'common',
                payload:{
                  peerTotal:0
                  }
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.getPeerTotalDocs,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            })

            test('createPeer->test',() => {
                const saga = effects.createPeer
                const actionCreator = {
                type:'common',
                  payload:{}           
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.createPeer,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            })

      })
})