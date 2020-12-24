const layoutModel = require('./channel').default
const {reducers,state} = layoutModel

describe('layoutModel->reducers',() => {
  test('common->test',() => {
        expect(reducers.common(
          {...state},
          {type:'common',payload:{
                curDate: 1
          }}
        )).toEqual({...state,curDate: 1})
     })
})