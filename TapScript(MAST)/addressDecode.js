
import { Address, Script, Signer, Tap, Tx } from '@cmdcode/tapscript'

// origin
const address_input = 'bcrt1q738hdjlatdx9xmg3679kwq9cwd7fa2c84my9zk'

// You can decode any address, extract data, or convert to a scriptPubKey format.
const decoded = Address.decode(address_input)
// Example of the decoded data object.
// { 
//     prefix  : 'bcrt1q', 
//     type    : 'p2w', 
//     network : 'regtest', 
//     data    : 'f44f76cbfd5b4c536d11d78b6700b8737c9eab07',
//     script  : [ 'OP_0', 'f44f76cbfd5b4c536d11d78b6700b8737c9eab07' ]
// }
console.log(JSON.stringify(decoded))

// You can also quickly convert between address and scriptPubKey formats.
const bytes = Address.toScriptPubKey(address_input)
console.log(bytes)
// Bytes: 0014f44f76cbfd5b4c536d11d78b6700b8737c9eab07

const scriptPubKey = Address.toScriptPubKey(address_input)

const address_output = Address.fromScriptPubKey(scriptPubKey, 'regtest')
console.log(address_output)
// Address : bcrt1q738hdjlatdx9xmg3679kwq9cwd7fa2c84my9zk 
