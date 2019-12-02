import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  current_user: window.localStorage.getItem('current_user') || 'local_user',
  todos: JSON.parse(window.localStorage.getItem('vuetify-todos-user@' + (
    window.localStorage.getItem('current_user') || 'local_user')) ||
    '{"groups": ["All", "Education", "LifeStyle"], "data": []}'),
  checked_login_status: false
}

// The only way to actually change state
const mutations = {
  addTodo (state, todo) {
    state.todos['data'].push(todo)
  },
  removeTodo (state, todo) {
    state.todos['data'].splice(state.todos['data'].indexOf(todo), 1)
  },
  editTodo (state, { todo, text = todo.text, done = todo.done, due = todo.due,
      group = todo.group }) {
    todo.text = text
    todo.done = done
    todo.due = due
    todo.group = group
  },
  addGroup (state, groupName) {
    if (!state.todos['groups'].includes(groupName)) {
      state.todos['groups'].push(groupName)
    }
  },
  removeEmptyGroup (state, groupName) {
    if (state.todos['groups'].includes(groupName) &&
        state.todos['data'].filter(todo => todo.group === groupName).length === 0) {
      state.todos['groups'].splice(state.todos['groups'].indexOf(groupName), 1)
    }
  },
  changeGroupName (state, { oldName, newName }) {
    if (state.todos['groups'].includes(oldName) && !state.todos['groups'].includes(newName)) {
      const idx = state.todos['groups'].indexOf(oldName)
      state.todos['groups'][idx] = newName
    }
  },
  update_user (state, username) {
    window.localStorage.setItem('current_user', username)
    state.current_user = username
  },
  updateAll (state, todos) {
    state.todos = todos
  },
  resetAll (state) {
    state.todos = JSON.parse('{"groups": ["All", "Education", "LifeStyle"], "data": []}')
  },
  updateAllFromLocal (state) {
    state.todos = JSON.parse(window.localStorage.getItem('vuetify-todos-user@local_user') ||
      '{"groups": ["All", "Education", "LifeStyle"], "data": []}')
  }
}

// actions commit mutations
const actions = {
  addTodo ({ state, commit }, { text, due, group }) {
    // console.log('COMMIT addTodo: ' + [text, due, group])
    const uid = Date.now()
    commit('addTodo', {
      uid: uid,
      group: group,
      text: text,
      due: due,
      done: false
    })
  },
  removeTodo ({ commit }, todo) {
    commit('removeTodo', todo)
  },
  toggleTodo ({ commit }, todo) {
    commit('editTodo', { todo, done: !todo.done })
  },
  editTodo ({ commit }, { todo, value }) {
    commit('editTodo', { todo, text: value })
  },
  toggleAll ({ state, commit }, { group, done }) {
    state.todos['data'].filter(todo => todo.group === group).forEach((todo) => {
      commit('editTodo', { todo, done })
    })
  },
  clearCompleted ({ state, commit }, group) {
    state.todos['data'].filter(todo => todo.group === group && todo.done)
      .forEach(todo => {
        commit('removeTodo', todo)
      })
  },
  addGroup ({ commit }, groupName) {
    commit('addGroup', groupName)
  },
  removeGroup ({ state, commit }, groupName) {
    var item_cnt = 0
    state.todos['data'].filter(todo => todo.group === groupName).forEach(todo => {
      commit('removeTodo', todo)
      item_cnt += 1
    })
    commit('removeEmptyGroup', groupName)
    return item_cnt
  },
  changeGroupName ({ state, commit }, { oldName, newName }) {
    state.todos['data'].filter(todo => todo.group === oldName).forEach(todo => {
      commit('editTodo', { todo, group: newName })
    })
    commit('changeGroupName', { oldName, newName })
  },
  login ({ commit }, username) {
    commit('update_user', username)
  },
  logout ({ commit }) {
    // TODO: remove the local storage
    commit('update_user', 'local_user')
    commit('updateAllFromLocal')
  },
  updateAll ({ commit }, todos) {
    commit('updateAll', todos)
  },
  resetAll ({ commit }) {
    commit('resetAll')
  }
}

const plugins = [store => {
  store.subscribe((mutation, { todos, current_user }) => {
    console.log('DEBUG: store.subscript: ' + JSON.stringify(mutation))
    // Hack: dont store todolist when update_user
    if (mutation.type !== 'update_user') {
      window.localStorage.setItem('vuetify-todos-user@' + (
       window.localStorage.getItem('current_user') || 'local_user'), JSON.stringify(todos))
    }
    window.localStorage.setItem('current_user', current_user)
  })
}]

export default new Vuex.Store({
  state,
  mutations,
  actions,
  plugins
})
