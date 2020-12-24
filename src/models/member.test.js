const memberModel = require('./member').default
const {reducers,state} = memberModel

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