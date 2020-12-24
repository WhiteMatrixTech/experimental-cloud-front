const userModel = require('./channel').default
const {reducers,state} = userModel

describe('userModel->reducers',() => {
  test('common->test',() => {
        expect(reducers.common(
          {...state},
          {type:'common',payload:{
                loginInfo: 'ssy'
          }}
        )).toEqual({...state,loginInfo: 'ssy'})
     })
})