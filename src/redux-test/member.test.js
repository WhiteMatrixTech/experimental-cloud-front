import * as API from '../services/member';
import {call, put } from 'redux-saga/effects'

const memberModel = require('../models/member').default
const {reducers,state,effects} = memberModel


describe('member->test',()=>{
      describe('memberModel->reducers',()=>{
          test('common->test',() => {
              expect(reducers.common(
                {...state},
                {type:'common',payload:{
                      memberTotal: 1
                }}
              )).toEqual({...state,memberTotal: 1})
          })
      })

      describe('memberModel->effects',()=>{
          test('getMemberTotalDocs->test',() => {
                const saga = effects.getMemberTotalDocs
                const actionCreator = {
                type:'common',
                payload:{
                  memberTotal:0
                  }
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.getMemberTotalDocs,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            })

             test('getPageListOfCompanyMember->test',() => {
                const saga = effects.getPageListOfCompanyMember
                const actionCreator = {
                type:'common',
                payload:{
                  memberList:[]
                  }
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.getPageListOfCompanyMember,actionCreator.payload))
                generator.next({
                  statusCode : 'ok',
                  result: 9
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            })
             test('setStatusOfLeagueConpany->test',() => {
                const saga = effects.setStatusOfLeagueConpany
                const actionCreator = {
                type:'common',
                payload:{}
                  
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.setStatusOfLeagueConpany,actionCreator.payload))
                generator.next({
                  statusCode : 'ok'
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            })
            test('setCompanyApprove->test',() => {
                const saga = effects.setCompanyApprove
                const actionCreator = {
                type:'common',
                payload:{}
              }
                const generator = saga(actionCreator,{call,put})
                let next = generator.next()
                expect(next.value).toEqual(call(API.setCompanyApprove,actionCreator.payload))
                generator.next({
                  statusCode : 'ok'
                  })
                next = generator.next()      
                expect(next.done).toEqual(true)
            })

            
      })
})