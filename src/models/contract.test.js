
const contractModel = require('./contract').default
const{reducers,state} = contractModel
describe('contractModel->reducers',()=>{
    test('common->test',() => {
        expect(reducers.common(
          {...state},
          {type:'common',payload:{
                myContractTotal: 1
          }}
        )).toEqual({...state,myContractTotal: 1})
     })
})