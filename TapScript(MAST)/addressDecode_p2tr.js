
import { Address, Script, Signer, Tap, Tx } from '@cmdcode/tapscript'

// testNet
const address_input = 'tb1p3q4h5mca7mj6hk7tgvqzjg6l2eaze402yjx3jtay23truc6qcf4qja69r5'

// You can decode any address, extract data, or convert to a scriptPubKey format.
const decoded = Address.decode(address_input)
// Example of the decoded data object.
// {
//     prefix: 'tb1p',
//     type: 'p2tr',
//     network: 'testnet',
//     data: Buff(32) [Uint8Array] [
//       136,  43, 122, 111, 29, 246, 229, 171,
//       219, 203,  67,   0, 41,  35,  95,  86,
//       122,  44, 213, 234, 36, 141,  25,  47,
//       164,  84,  86,  62, 99,  64, 194, 106
//     ],
//     script: [
//       'OP_1',
//       '882b7a6f1df6e5abdbcb430029235f567a2cd5ea248d192fa454563e6340c26a'
//     ]
// }

console.log(JSON.stringify(decoded))

// You can also quickly convert between address and scriptPubKey formats.
const bytes = Address.toScriptPubKey(address_input)
console.log(bytes)
// Bytes: 5120882b7a6f1df6e5abdbcb430029235f567a2cd5ea248d192fa454563e6340c26a

const scriptPubKey = Address.toScriptPubKey(address_input)

const address_output = Address.fromScriptPubKey(scriptPubKey, 'testnet')
console.log(address_output)
// Address : tb1p3q4h5mca7mj6hk7tgvqzjg6l2eaze402yjx3jtay23truc6qcf4qja69r5 
