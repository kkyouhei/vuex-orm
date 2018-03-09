import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Performance – Retrieve – BelongsToMany', () => {
  it.only('should retrieve belongsToMany relation in time', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    class RoleUser extends Model {
      static entity = 'roleUsers'

      static primaryKey = ['role_id', 'user_id']

      static fields () {
        return {
          role_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const users = []
    const roles = []
    const roleUsers = []

    for (let i = 1; i <= 2000; i++) {
      users.push({ id: i })
    }

    for (let i = 1; i <= 2000; i++) {
      roles.push({ id: i })
    }

    for (let i = 1; i <= 2000; i++) {
      roleUsers.push({ user_id: i, role_id: i })
    }

    const store = createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await store.dispatch('entities/users/create', { data: users })
    await store.dispatch('entities/roles/create', { data: roles })
    await store.dispatch('entities/roleUsers/create', { data: roleUsers })

    console.time('time')

    const result = store.getters['entities/users/query']().with('roles').get()

    console.log('--TEST TIME--------------')
    console.timeEnd('time')
    console.log('-------------------------')
  }).timeout(20000)
})
