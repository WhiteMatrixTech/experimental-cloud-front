const channelModel = require('./channel').default
const {reducers,state} = channelModel

describe('channelModel->reducers',() => {
  test('common->test',() => {
        expect(reducers.common(
          {...state},
          {type:'common',payload:{
                transactionTotal: 1
          }}
        )).toEqual({...state,transactionTotal: 1})
     })
})