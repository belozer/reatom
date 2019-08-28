import { bench } from '../bench'
import * as RA from './reatom';
import * as RE from './redux'

const times = (len: number, fn: (index: number) => void) => {
  for(let i = 0; i < len; i++) fn(i)
}

[10, 100].forEach(count => [1, 10, 50].forEach(subscribersCount => {
  ['ALL', 'COMPLETED', 'ACTIVE'].forEach((filter: any) => {
    bench(`(${subscribersCount}) ${count} todos | ${filter} [reatom]`, (store) => {
      store = RA.initializeStore()
      store.dispatch(RA.setVisibilityFilter(filter));

      times(subscribersCount, () => store.subscribe(RA.TodosContent, () => {}))

      times(count, i => store.dispatch(RA.addTodo({ id: i, text: `MyTodo ${i}` })))
      times(count, i => store.dispatch(RA.toggleTodo(i)))
    }, {
      before: () => RA.initializeStore() 
    })

    bench(`(${subscribersCount}) ${count} todos | ${filter} [redux]`, (store) => {
      store = RE.initializeStore()
      store.dispatch(RE.setVisibilityFilter(filter));

      times(subscribersCount, () => store.subscribe(() => RE.getVisibleTodos(store.getState(), filter)))

      times(count, i => store.dispatch(RE.addTodo({ id: i, text: `MyTodo ${i}` })))
      times(count, i => store.dispatch(RE.toggleTodo(i)))
    }, {
      before: () => RE.initializeStore() 
    })
  })
}))
