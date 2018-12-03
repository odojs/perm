module.exports = () => {
  const res = {
    _forward: {},
    _backward: {},
    _permissions: {},
    add: (from, to) => {
      if (!res._forward[from]) res._forward[from] = {}
      res._forward[from][to] = true
      if (!res._backward[to]) res._backward[to] = {}
      res._backward[to][from] = true
    },
    remove: (from, to) => {
      if (res._forward[from]) delete res._forward[from][to]
      if (res._backward[to]) delete res._backward[to][from]
    },
    allow: (from, to) => {
      if (!res._permissions[from]) res._permissions[from] = {}
      res._permissions[from][to] = true
    },
    disallow: (from, to) => {
      if (!res._permissions[from]) return
      delete res._permissions[from][to]
    },
    parents: (from) => {
      if (!res._forward[from]) return []
      return Object.keys(res._forward[from])
    },
    hasparent: (from, to) => {
      if (!res._forward[from]) return false
      for (let child of Object.keys(res._forward[from])) {
        if (child == to) return true
        if (res.hasparent(child, to)) return true
      }
      return false
    },
    ancestors: (from) => {
      let current = []
      let processing = [from]
      let ancestors = []
      while (processing.length > 0) {
        ancestors = ancestors.concat(current)
        current = []
        for (let check of processing)
          current = current.concat(res.parents(check))
        processing = current
      }
      return ancestors
    },
    children: (from) => {
      if (!res._backward[from]) return []
      return Object.keys(res._backward[from])
    },
    haschild: (from, to) => {
      if (!res._backward[from]) return false
      for (let child of Object.keys(res._backward[from])) {
        if (child == to) return true
        if (res.haschild(child, to)) return true
      }
      return false
    },
    descendants: (from) => {
      let current = []
      let processing = [from]
      let descendants = []
      while (processing.length > 0) {
        descendants = descendants.concat(current)
        current = []
        for (let check of processing)
          current = current.concat(res.children(check))
        processing = current
      }
      return descendants
    },
    members: (from) => [from].concat(res.ancestors(from)),
    permissions: (from) => {
      const members = res.members(from).concat(res.members('*'))
      let permissions = []
      for (let member of members) {
        if (!res._permissions[member]) continue
        permissions = permissions.concat(Object.keys(res._permissions[member]))
      }
      return permissions
    },
    can: (from, to) => {
      const members = res.members(from).concat(res.members('*'))
      for (let member of members) {
        if (!res._permissions[member]) continue
        if (res._permissions[member][to]) return true
        if (res._permissions[member]['*']) return true
      }
      return false
    }
  }
  return res
}