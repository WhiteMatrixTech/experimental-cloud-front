import * as API from '../services/certificate';
import {call, put } from 'redux-saga/effects'

const certificateModel = require('../models/certificate').default
const{reducers,state,effects} = certificateModel
describe('certificate->test',()=>{
    describe('certificateModel->reducers',()=>{
        test('common->test',() => {
            expect(reducers.common(
              {...state},
              {type:'common',payload:{
                    certificateTotal: 1
              }}
            )).toEqual({...state,certificateTotal: 1})
        })
    })

    describe('certificateModel->effects',()=>{
         test('getCertificateList->test',() => {
            const saga = effects.getCertificateList
            const actionCreator = {
              type:'common',
              payload:{
                certificateList: [],
                certificateTotal: ''
                 }
               }
            const generator = saga(actionCreator,{call,put})
            let next = generator.next()
            expect(next.value).toEqual(call(API.getCertificateList,actionCreator.payload))
            generator.next({
              statusCode : 'ok',
              result: 1
            })
          
            next = generator.next()      
            expect(next.done).toEqual(true)
          })
     })

     
})