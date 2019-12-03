<template>
  <div>
    <v-layout row wrap>
      <v-flex text-xs-center>
        <!-- new todo bar -->
        <v-card class="ma-8">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header v-slot="{ open }" ripple>
                <!-- use @click.stop to prevent emiting the event from child node (i.e. TextField)
                to parent node (i.e. ExpansionPanel) -->
                <v-text-field
                  :label="'New todo input'"
                  @keydown.enter="addOneTodo"
                  dense
                  autocomplete="off"
                  clearable
                  color="primary"
                  flat
                  hide-details
                  maxlength="1023"
                  placeholder="What needs to be done?"
                  solo
                  v-model="newTodo"
                  style="font-size: 20px;"
                  @click.stop=""
                ></v-text-field>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="6">
                    <v-dialog
                      ref="dialog_date_ref"
                      v-model="date_dialog"
                      :return-value.sync="date"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="date"
                          label="Picker a date"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="date_dialog = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.dialog_date_ref.save(date)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                  <v-col cols="6">
                    <v-dialog
                      ref="dialog_time_ref"
                      v-model="time_dialog"
                      :return-value.sync="time"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="time"
                          label="Picker a time"
                          prepend-icon="access_time"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="time_dialog"
                        v-model="time"
                        full-width
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="time_dialog = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.dialog_time_ref.save(time)">OK</v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12">
                    <v-btn color="primary" right
                      @click="newTodo ? addOneTodo() : snack('The content of todo is required')">
                      Add New
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
        <!-- main list -->
        <v-card class="ma-8" v-show="todos.length">
          <v-progress-linear class="my-0"
            color="green"
            height="20" striped
            v-model="progressPercentage"/>
          <v-card-actions class="px-3" v-show="todos.length">
            <v-list max-width="200" ma-0>
              <v-list-item dense class="dense-count">
                <v-list-item-content>
                  <v-list-item-title class="primary--text">
                    {{ remaining }} {{ remaining | pluralize('item') }} left
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item dense class="dense-count">
                <v-list-item-content>
                  <v-list-item-title class="primary--text">
                    {{ total }} {{ total | pluralize('item') }} in total
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-spacer></v-spacer>
            <v-btn-toggle
              class="elevation-0"
              mandatory
              v-model="visibility"
              v-show="todos.length"
            >
              <v-btn
                :key="key"
                :to="key"
                :value="key"
                class="mx-0"
                color="primary"
                text
                small
                v-for="(val, key) in filters"
              >
                {{ key | capitalize }}
              </v-btn>
            </v-btn-toggle>
          </v-card-actions>
          <v-list class="pa-0" two-line>
            <template v-for="todo in filteredTodos">
              <v-divider :key="`${todo.uid}-divider`"></v-divider>
              <TodoItem
                :key="todo.uid"
                :todo="todo"
                :group="current_group"
              />
            </template>
          </v-list>
        </v-card>
        <v-btn
          @click="clearCompleted"
          block
          class="mt-8"
          color="primary"
          depressed
          rounded
          v-if="visibility == 'completed'"
          v-show="todos.length > remaining"
        >
          Clear completed
        </v-btn>
        <!-- footer -->
        <!-- <footer-info></footer-info> -->
      </v-flex>
    </v-layout>
    <!-- snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
    >
      {{ snackbar_text }}
      <v-btn
        color="blue"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TodoItem from '@/components/TodoItem.vue'
const today_date = new Date().toISOString().substr(0, 10)
// import FooterInfo from '@/components/FooterInfo.vue'
const filters = {
  active: todos => todos.filter(todo => !todo.done),
  // TODO: add today filter
  today: todos => todos.filter(todo => todo.due && todo.due.startsWith(today_date)),
  all: todos => todos,
  completed: todos => todos.filter(todo => todo.done)
}

export default {
  props: ['filter'],
  components: {
    TodoItem
    // FooterInfo
  },
  data () {
    return {
      newTodo: '',
      filters: filters,
      visibility: this.filter,
      current_group: this.$route.query.group || 'All',
      // date: new Date().toISOString().substr(0, 10),
      date: null,
      date_dialog: false,
      time: null,
      time_dialog: false,
      snackbar: false,
      snackbar_text: 'No message'
    }
  },
  computed: {
    todos () {
      // console.log('DEBUG: current_group: ' + this.current_group)
      // console.log('DEBUG: todos: ' + JSON.stringify(this.$store.state.todos))
      return this.$store.state.todos['data'].filter(todo => todo.group === this.current_group ||
        todo.group === 'All' || this.current_group === 'All')
    },
    allChecked () {
      return this.todos.every(todo => todo.done)
    },
    filteredTodos () {
      // console.log('DEBUG filteredTodos: ' + JSON.stringify(
        // filters[this.visibility](this.todos)))
      return filters[this.visibility](this.todos)
    },
    remaining () {
      return this.todos.filter(todo => !todo.done).length
    },
    total () {
      return this.todos.length
    },
    progressPercentage () {
      const len = this.todos.length
      return ((len - this.remaining) * 100) / len
    }
  },
  methods: {
    ...mapActions([
      // 'toggleAll',
      'clearCompleted',
      'addTodo'
    ]),
    snack (msg) {
      this.snackbar_text = msg
      this.snackbar = true
    },
    addOneTodo () {
      const text = this.newTodo.trim()
      if (this.time !== null && this.date === null) {
        this.snack('Date is require when time is set')
      } else if (text) {
        const due = (this.time && this.date) ? ([this.date, this.time].join(' ')) : null
        const grp = this.current_group
        this.addTodo({ text, due, group: grp })
        this.newTodo = ''
        this.date = null
        this.time = null
      }
      console.log('DEBUG group: ' + this.current_group)
      console.log('DEBUG todos: ' + JSON.stringify(this.todos))
    }
  },
  filters: {
    pluralize: (n, w) => n === 1 ? w : (w + 's'),
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  }
}
</script>

<style lang="stylus">
.v-text-field .v-input__slot
  padding: 0 !important
.v-list-item.dense-count
  min-height: 15px
  height: 10px
</style>
