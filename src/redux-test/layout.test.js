import {call, put } from 'redux-saga/effects'
const layoutModel = require('../models/layout').default
const {reducers,state,effects} = layoutModel


describe('layout->test',()=>{
      describe('layoutModel->reducers',() => {
          test('common->test',() => {
                expect(reducers.common(
                  {...state},
                  {type:'common',payload:{
                        curDate: 1
                  }}
                )).toEqual({...state,curDate: 1})
            })
      })

      describe('layoutModel->effects',()=>{
          test('getNewMenuList->test',() => {
            //const {call,put} = effects
              const saga = effects.getNewMenuList
              const actionCreator = {
              type:'common',
              payload:{
                userType:''
                }
            }
              const generator = saga(actionCreator,{call,put})
              let next = generator.next()
              generator.next({
                statusCode : 'ok',
                result: 9
                })
              next = generator.next()      
              expect(next.done).toEqual(true)
          })


      })
})