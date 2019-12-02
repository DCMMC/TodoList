<template>
  <v-app id="app">
    <v-content>
      <v-container id="container">
      <v-layout row justify-center class="ma-0" style="height: 100%">
          <v-flex xs12 sm8>
            <v-card class="overflow-hidden" style="height: 100%">
              <!-- <v-toolbar color="blue darken-4" dark> -->
              <v-app-bar
                color="blue darken-4"
                dark
                prominent
              >
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title class="headline">
                  Todo App - {{ groups[current_group] }}
                </v-toolbar-title>

                <v-progress-linear
                  :active="loading"
                  :indeterminate="loading"
                  absolute
                  color="pink"
                  height="8"
                ></v-progress-linear>

                <v-spacer></v-spacer>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="grp_dialog = true">
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Group Setting</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon @click="dark" v-on="on">
                      <v-icon v-model="isDark" @click="isDark = !isDark">
                        {{ isDark ? 'check_circle' : 'check_circle_outline' }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Dark mode {{isDark ? 'on' : 'off'}}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="sync_account">
                      <v-icon>mdi-cloud-sync</v-icon>
                    </v-btn>
                  </template>
                  <span>Sync to yout account</span>
                </v-tooltip>

              <!-- </v-toolbar> -->
              </v-app-bar>
              <v-navigation-drawer
                v-model="drawer"
                absolute
                bottom
                temporary
              >
                <v-list
                  nav
                  dense
                >
                  <v-subheader>Groups</v-subheader>
                  <v-list-item-group
                    v-model="current_group"
                    active-class="deep-purple--text text--accent-4"
                  >
                    <v-list-item
                      v-for="group in groups"
                      :key="group">
                      <v-list-item-icon>
                        <v-icon v-if="group == 'All'" color="pink">mdi-star</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ group }}</v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                  <v-list-item @click="new_grp_dialog = true">
                    <v-list-item-icon>
                      <v-icon color="pink">mdi-folder-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Add new group</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-subheader>Account</v-subheader>
                  <v-list-item @click="login_or_logout">
                    <v-list-item-icon>
                      <v-icon color="pink" v-if="current_user !== 'local_user'">
                        mdi-logout
                      </v-icon>
                      <v-icon color="pink" v-else>mdi-login</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ current_user === 'local_user' ? 'Login' : 'Logout' }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-navigation-drawer>
              <!-- dialogs -->
              <v-dialog
                v-model="grp_dialog"
                width="400px"
                persistent
              >
                <v-card>
                  <v-card-title>
                    <span class="headline">Group Setting</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="newGroupName"
                            prepend-icon="mdi-clipboard-list-outline"
                            label="Set the group name" required>
                          </v-text-field>
                        </v-col>
                        <v-layout align-center>
                          <v-col cols="9">
                            <span class="subtitle-2">Remove this group</span>
                          </v-col>
                        </v-layout>
                          <v-col cols="3">
                            <v-switch
                              v-model="ifRemoveGroup"
                              color="error"
                              hide-details
                            ></v-switch>
                          </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="grp_dialog = false">Close</v-btn>
                    <v-btn color="blue darken-1" text @click="settingGroup">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog
                v-model="new_grp_dialog"
                width="400px"
                persistent
              >
                <v-card>
                  <v-card-title>
                    <span class="headline">New Group</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="addGroupName"
                            prepend-icon="mdi-clipboard-list-outline"
                            label="Set the group name" required>
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="new_grp_dialog = false">Close</v-btn>
                    <v-btn color="blue darken-1" text @click="addNewGroup">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- main page -->
              <router-view v-if="isRouterViewAlive"></router-view>
              <!-- snackbar -->
              <v-snackbar
                v-model="snackbar"
              >
                {{ snackmsg }}
                <v-btn
                  color="blue"
                  text
                  @click="snackbar = false"
                >
                  Close
                </v-btn>
              </v-snackbar>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<style lang="stylus" scope>
#container
  max-width: 950px
  height: 100%
  padding: 8px
</style>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'
export default {
  data () {
    return {
      loading: false,
      isRouterViewAlive: true,
      isDark: false,
      drawer: false,
      current_group: (this.$route.query.group &&
        this.$store.state.todos['groups'].indexOf(this.$route.query.group)) || 0,
      grp_dialog: false,
      newGroupName: this.$route.query.group,
      ifRemoveGroup: false,
      snackbar: false,
      snackmsg: 'Message',
      addGroupName: 'Group',
      new_grp_dialog: false,
      current_user: this.$store.state.current_user
    }
  },
  mounted: function () {
    axios.get('/log_state').then(res => {
      console.log('DEBUG: ' + JSON.stringify(res.data.result) + ', ' + this.current_user)
      if (res.data.result === true && res.data.username !== this.current_user) {
        this.login(res.data.username)
        this.current_user = res.data.username
        axios.get('/get').then(res => {
            console.log('DEBUG: ' + JSON.stringify(res))
          if (res.data.code === 'success') {
            console.log('DEBUG: ' + JSON.stringify(res.data))
            if (Object.keys(res.data.todolist).length > 0) {
              this.updateAll(res.data.todolist)
            } else {
              this.resetAll()
            }
            // force update the computed groups
            this.$forceUpdate()
          } else if (res.data.code === 'error') {
            // setTimeout(() => {
            this.snackmsg = 'Fetch todolist from server failed: ' + JSON.stringify(res.data.msg)
            this.snackbar = true
            // }, 1000)
          } else {
            console.log('Unexpected error: ' + res.toJson())
          }
        }).catch(err => {
          console.log('axios get "/get" error: ' + JSON.stringify(err))
        })
      } else if (!res.data.result && this.current_user !== 'local_user') {
        console.log('DEBUG: logout')
        this.logout()
        this.current_user = 'local_user'
        this.$forceUpdate()
      } 
    }).catch(err => {
      console.log('axios get "/log_state" error: ' + JSON.stringify(err))
    })
  },
  methods: {
    login_or_logout () {
      const href = this.current_user === 'local_user' ? '/login/index.html': '/logout_handler'
      window.location.href = href
    },
    sync_account () {
      if (this.current_user === 'local_user') {
        this.snackmsg = 'You must login to sync'
        this.snackbar = true
      } else {
        this.loading = true
        axios.post('/upload', {
          username: this.current_user,
          todolist: this.$store.state.todos
        }).then(res => {
          this.loading = false
          if (res.data.code === 'success') {
            this.snackmsg = res.data.msg
            this.snackbar = true
          } else {
            this.snackmsg = 'Error: ' + JSON.stringify(res)
            this.snackbar = true
          }
        }).catch(res => {
          const err_msg = 'Error when upload todolist to server: ' + res.toJson()
          console.log(err_msg)
          this.loading = false
          this.snackmsg = err_msg
          this.snackbar = true
        })
      }
    },
    dark: function (evt) {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    ...mapActions([
      'removeGroup',
      'addGroup',
      'changeGroupName',
      'login',
      'logout',
      'updateAll',
      'resetAll'
    ]),
    addNewGroup () {
      if (this.groups.includes(this.addGroupName)) {
        this.new_grp_dialog = false
        this.snackmsg = 'The new group name already existed'
        this.snackbar = true
      } else {
        // TODO: need for returned information to indicate the status of the operation
        this.addGroup(this.addGroupName)
        this.new_grp_dialog = false
        this.snackmsg = 'Success add new group: ' + this.addGroupName
        this.snackbar = true
        window.setTimeout(() => {
          this.current_group = this.groups.indexOf(this.addGroupName)
          // this.$router.push('/all?group=' + this.addGroupName)
          // this.isRouterViewAlive = false
          // this.$nextTick(() => {
          //   this.isRouterViewAlive = true
          // })
        }, 1000)
      }
    },
    settingGroup () {
      if (this.ifRemoveGroup) {
        const grpName = this.groups[this.current_group]
        this.removeGroup(grpName)
        this.snackmsg = 'Removed group: ' + grpName
        this.ifRemoveGroup = false
        this.grp_dialog = false
        this.snackbar = true
        window.setTimeout(() => {
          this.current_group = 0
          // this.$router.push('/all?group=' + this.groups[0])
          // this.isRouterViewAlive = false
          // this.$nextTick(() => {
          //   this.isRouterViewAlive = true
          // })
        }, 1000)
      } else if (this.newGroupName !== this.$route.query.group) {
        if (!this.groups.includes(this.newGroupName)) {
          const oldGrp = this.$route.query.group
          const newGrp = this.newGroupName
          this.changeGroupName({ oldName: oldGrp, newName: newGrp })
          this.snackmsg = 'Change group name to ' + this.newGroupName
          this.grp_dialog = false
          this.snackbar = true
          window.setTimeout(() => {
            // TODO: redirect to the current with new name
            this.current_group = 0 
            this.newGroupName = 'All'
            // this.$router.push('/all?group=' + this.groups[this.newGroupName])
            // this.isRouterViewAlive = false
            // this.$nextTick(() => {
            //   this.isRouterViewAlive = true
            // })
          }, 1000)
        } else {
          this.grp_dialog = false
          this.snackmsg = 'New group name already existed'
          this.snackbar = true
        }
      } else {
        this.snackmsg = 'Nothing changed'
        this.grp_dialog = false
        this.snackbar = false
      }
    }
  },
  computed: {
    groups () {
        return this.$store.state.todos['groups']
    }
  },
  watch: {
    current_group (newVal, oldVal) {
      this.drawer = false
      if (newVal !== oldVal) {
        this.newGroupName = this.groups[newVal]
        this.$router.push('/all?group=' + this.groups[newVal])
        this.isRouterViewAlive = false
        this.$nextTick(() => {
          this.isRouterViewAlive = true
        })
      }
    },
  },
}
</script>
