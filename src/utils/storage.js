import store from 'store'
import expirePlugin from 'store/plugins/expire'

store.addPlugin(expirePlugin)

const NANESPACE = 'devopsss_'
const DEFAULT_EXPIRATION = 7
export default {
  set(key, value, expired = DEFAULT_EXPIRATION) {
    return store.set(this.key(key), value, { expires: expired })
  },
  get(key) {
    try {
      return store.getJSON(this.key(key))
    } catch (err) {
      return store.get(this.key(key))
    }
  },
  key(name) {
    return NANESPACE + name
  },
  remove(name) {
    store.remove(this.key(name))
  },
}
