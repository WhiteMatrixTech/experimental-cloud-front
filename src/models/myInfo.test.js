const myInfoModel = require('./channel').default
const {reducers,state} = myInfoModel

describe('myInfoModel->reducers',() => {
  test('common->test',() => {
        expect(reducers.common(
          {...state},
          {type:'common',payload:{
                myLeague: 1
          }}
        )).toEqual({...state,myLeague: 1})
     })
})