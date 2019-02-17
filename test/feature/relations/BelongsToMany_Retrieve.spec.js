import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Relations – Belongs To Many – Retrieve', () => {
  it('can resolve belongs to relation with primary key set to id', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class RoleUser extends Model {
      static entity = 'role_users'

      static fields () {
        return {
          id: this.attr(null),
          role_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await User.create({
      data: [ { id: 1 }, { id: 2} ]
    })

    await Role.create({
      data: { id: 1 }
    })

    await RoleUser.create({
      data: { id: 1, user_id: 1, role_id: 1 }
    })

    const users = User.query().with('roles').get()

    expect(users[0].id).toBe(1)
    expect(users[0].roles.length).toBe(1)
    expect(users[0].roles[0].id).toBe(1)

    expect(users[1].id).toBe(1)
    expect(users[1].roles.length).toBe(0)
  })
})
