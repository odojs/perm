# Permissions
Super simple permissions.

```js
var perm = require('perm');
perm = perm();

perm.allow('*', 'view things');
perm.allow('user1', 'edit things');
perm.allow('group1', 'delete things');
// false
console.log(perm.can('user1', 'delete things'));
perm.add('user1', 'group1');
// true
console.log(perm.can('user1', 'delete things'));
perm.add('group1', 'group2');
// ['group1']
console.log(perm.parents('user1'));
//['group1', 'group2']
console.log(perm.ancestors('user1'));
// ['user1', 'group1', 'group2']
console.log(perm.members('user1'));
// ['edit things', 'delete things', 'view things']
console.log(perm.permissions('user1'));
console.log(perm.children('group2'));
console.log(perm.descendants('group2'));
perm.remove('user1', 'group1');
// false
console.log(perm.can('user1', 'delete things'));
```