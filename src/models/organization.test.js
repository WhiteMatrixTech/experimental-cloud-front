const organizationModel = require('./channel').default
const {reducers,state} = organizationModel

describe('organizationModel->reducers',() => {
  test('common->test',() => {
        expect(reducers.common(
          {...state},
          {type:'common',payload:{
                orgTotal: 1
          }}
        )).toEqual({...state,orgTotal: 1})
     })
})