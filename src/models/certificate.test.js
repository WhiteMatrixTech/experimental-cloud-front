const certificateModel = require('./block').default
const{reducers,state} = certificateModel
describe('certificateModel->reducers',()=>{
    test('common->test',() => {
        expect(reducers.common(
          {...state},
          {type:'common',payload:{
                certificateTotal: 1
          }}
        )).toEqual({...state,certificateTotal: 1})
     })
})