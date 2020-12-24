const unionModel = require('./channel').default
const {reducers,state} = unionModel

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