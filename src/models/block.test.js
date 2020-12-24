import * as API from '../services/block';
import {call, put } from 'redux-saga/effects'

const blockModel = require('./block').default
const{reducers,state,effects} = blockModel
describe('blockModel->reducers',()=>{
    test('common->test',() => {
        expect(reducers.common(
          {...state},
          {type:'common',payload:{
                transactionTotal: 1
          }}
        )).toEqual({...state,transactionTotal: 1})
     })
})

describe('blockModel->effects',() => {
  test('getBlockTotalDocs->test',() => {
     //const {call,put} = effects
     const saga = effects.getBlockTotalDocs
     const actionCreator = {
       type:'common',
       payload:{
         blockTotal:0
        }
     }
      const generator = saga(actionCreator,{call,put})
      let next = generator.next()
      expect(next.value).toEqual(call(API.getBlockTotalDocs,actionCreator.payload))
       generator.next({
        statusCode : 'ok',
        data: 9
      })
      next = generator.next()      
     expect(next.done).toEqual(true)
  })

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
      expect(next.value).toEqual(call(API.getBlockList,actionCreator.payload))
       generator.next({
        statusCode : 'ok',
        data: [{blockHash: "3785b24093f6feaf29c380d3dfe1a909bb531394015303d3c47ba965be6c00e3",
                     blockSize: "6",
            channelGenesisHash: "6074ff24681e19d8a07d382fa190e07e972aaeaa65d0c19b69b0a2a96eea01ac",
                   channelName: "mychannel",
               createTimestamp: "2020-11-23T07:26:33.999Z",
                     createdAt: "2020-12-22T08:22:15.871Z",
                      dataHash: "633ced809c425a1097c3f5073343f55ec203836096b9529f78987f790aa68f85",
                   networkName: "network1",
                        number: 8,
                 prevBlockHash: "2f3a29977d72320aea7a21ed3ffd6d520fc539871ede17fe3edab962dfdf7fca",
                  previousHash: "2f3a29977d72320aea7a21ed3ffd6d520fc539871ede17fe3edab962dfdf7fca",
                           tip: 8,
                       txCount: 1,
                     updatedAt: "2020-12-22T08:22:15.881Z",
          }]
      })
      next = generator.next()      
     expect(next.done).toEqual(true)
  })

})