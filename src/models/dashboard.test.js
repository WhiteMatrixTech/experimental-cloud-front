const dashboardModel = require('./channel').default
const {reducers,state} = dashboardModel

describe('organizationModel->reducers',() => {
  test('common->test',() => {
        expect(reducers.common(
          {...state},
          {type:'common',payload:{
                transactionList: [{txTd:1}]
          }}
        )).toEqual({...state,transactionList: [{txTd:1}]})
     })
})