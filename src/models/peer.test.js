const peerModel = require('./channel').default
const {reducers,state} = peerModel

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