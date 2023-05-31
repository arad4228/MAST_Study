
import { Address, Script, Signer, Tap, Tx } from '@cmdcode/tapscript'

const pubkey  = '0307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba3'

const [ tapkey1 ] = Tap.getPubKey(pubkey)
console.log("Tapkey1: ", tapkey1)

// Encode the script as bytes.
const bytes = Script.encode([ 'script' ])
console.log("Bytes: ", bytes)
// Convert the bytes into a tapleaf.
const target1 = Tap.tree.getLeaf(bytes)
console.log("Target1: ", target1)

// Provide the tapleaf as a target for generating the proof.
const [ tapkey2, cblock1 ] = Tap.getPubKey(pubkey, { target1 })

const scripts = [
    [ 'scripta' ],
    [ 'scriptb' ],
    [ 'scriptc' ]
]

// Convert the scripts into an array of tap leaves.
const tree = scripts
.map(e => Script.encode(e))
.map(e => Tap.tree.getLeaf(e))

// Optional: You can also add data to the tree.
//   const bytes = encodeData('some data')
//   const leaf  = Tap.tree.getLeaf(bytes)
//   tree.push(leaf)

// Select a target leaf for generating the proof.
const target2 = tree[0]

// Provide the tree and target leaf as arguments.
const [ tapkey3, cblock2 ] = Tap.getPubKey(pubkey, { tree, target2 })