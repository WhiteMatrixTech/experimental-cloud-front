const messageModel = require('./channel').default
const {reducers,state} = messageModel

describe('messageModel->reducers',() => {
  test('common->test',() => {
        expect(reducers.common(
          {...state},
          {type:'common',payload:{
                messageTotal: 1
          }}
        )).toEqual({...state,messageTotal: 1})
     })
})