
import { hash160 } from '@cmdcode/buff-utils'
import { Address, Script, Signer, Tap, Tx } from '@cmdcode/tapscript'

// Example 33-byte public key.
const pubkey  = '03d5af2a3e89cb72ff9ca1b36091ca46e4d4399abc5574b13d3e56bca6c0784679'
// You can encode / decode / convert keys and script hashes.
const keyhash = hash160(pubkey)

const address1 = Address.p2wpkh.fromPubKey(pubkey, 'regtest')
// Address: bcrt1q738hdjlatdx9xmg3679kwq9cwd7fa2c84my9zk
const address2 = Address.p2wpkh.encode(keyhash, 'regtest')
// Address: bcrt1q738hdjlatdx9xmg3679kwq9cwd7fa2c84my9zk
console.log("Address: " + address1)
console.log("Address: " + address2)

const bytes1   = Address.p2wpkh.decode(address1)
// KeyHash: f44f76cbfd5b4c536d11d78b6700b8737c9eab07
const bytes2 = Address.p2wpkh.decode(address2)
console.log("Bytes1: " + bytes1)
console.log("Bytes2: " + bytes2)

const script1  = Address.p2wpkh.scriptPubKey(bytes1)
// script: script: [ 'OP_0', 'f44f76cbfd5b4c536d11d78b6700b8737c9eab07' ]
const script2  = Address.p2wpkh.scriptPubKey(bytes2)
console.log("Script1: " + script1)
console.log("Script2: " + script2)