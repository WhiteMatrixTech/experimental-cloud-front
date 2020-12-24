const logModel = require('./channel').default
const {reducers,state} = logModel

describe('logModel->reducers',() => {
  test('common->test',() => {
        expect(reducers.common(
          {...state},
          {type:'common',payload:{
                logsTotal: 1
          }}
        )).toEqual({...state,logsTotal: 1})
     })
})