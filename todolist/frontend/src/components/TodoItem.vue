<template>
  <v-list-item class="todo-item" :class="{ 'editing': editing }">
    <v-list-item-action>
      <v-checkbox
        :input-value="todo.done"
        @change="toggleTodo(todo)"
        color="primary"
        v-if="!editing"
      ></v-checkbox>
      <v-icon
        color="primary"
        v-else
      >edit</v-icon>
    </v-list-item-action>
    <template v-if="!editing">
      <v-list-item-content
        @dblclick="editing = true"
      >
        <v-list-item-title :class="{ 'done': todo.done }">{{ todo.text }}</v-list-item-title>
        <v-list-item-subtitle v-if="todo.due">Due: {{ todo.due }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn
          @click="removeTodo(todo)"
          color="red"
          ripple
          fab
          dark
          x-small
        >
          <v-icon dark>close</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
    <v-text-field
      :value="todo.text"
      @blur="doneEdit"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      clearable
      color="primary"
      flat
      hide-details
      maxlength="1023"
      ref="input"
      solo
      v-else
      v-focus="editing"
    ></v-text-field>
  </v-list-item>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['todo', 'group'],
  data () {
    return {
      editing: false
    }
  },
  directives: {
    focus (el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          context.$refs.input.focus()
        })
      }
    }
  },
  methods: {
    ...mapActions([
      'editTodo',
      'removeTodo',
      'toggleTodo'
    ]),
    doneEdit (e) {
      const value = e.target.value.trim()
      const { todo, group } = this
      if (!value) {
        this.removeTodo({ group, todo })
      } else if (this.editing) {
        this.editTodo({
          todo,
          value
        })
        this.editing = false
      }
    },
    cancelEdit () {
      this.editing = false
    }
  }
}
</script>

<style lang="stylus">
.todo-item
  .v-list__item
    height: auto
    padding-top: 12px
    padding-bottom: 12px
  &.editing .v-list__item
    height: 48px
  .v-list-item__title.done
    text-decoration: line-through
    color: gray
</style>
