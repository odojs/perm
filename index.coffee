module.exports = ->
  res =
    _forward: {}
    _backward: {}
    _permissions: {}
    add: (from, to) ->
      res._forward[from] = {} if !res._forward[from]?
      res._forward[from][to] = yes
      res._backward[to] = {} if !res._backward[to]?
      res._backward[to][from] = yes
    remove: (from, to) ->
      delete res._forward[from][to] if res._forward[from]?
      delete res._backward[to][from] if res._backward[to]?
    allow: (from, to) ->
      res._permissions[from] = {} if !res._permissions[from]?
      res._permissions[from][to] = yes
    disallow: (from, to) ->
      return if !res._permissions[from]?
      delete res._permissions[from][to]
    parents: (from) ->
      return [] if !res._forward[from]?
      Object.keys res._forward[from]
    ancestors: (from) ->
      current = []
      processing = [from]
      ancestors = []
      while processing.length > 0
        ancestors = ancestors.concat current
        current = []
        current = current.concat res.parents check for check in processing
        processing = current
      ancestors
    children: (from) ->
      return [] if !res._backward[from]?
      Object.keys res._backward[from]
    descendants: (from) ->
      current = []
      processing = [from]
      descendants = []
      while processing.length > 0
        descendants = descendants.concat current
        current = []
        current = current.concat res.children check for check in processing
        processing = current
      descendants
    members: (from) ->
      [from].concat res.ancestors from
    permissions: (from) ->
      members = res.members(from).concat res.members '*'
      permissions = []
      for member in members
        continue if !res._permissions[member]?
        permissions = permissions.concat Object.keys res._permissions[member]
      permissions
    can: (from, to) ->
      members = res.members(from).concat res.members '*'
      for member in members
        continue if !res._permissions[member]?
        return yes if res._permissions[member][to]?
        return yes if res._permissions[member]['*']?
      no