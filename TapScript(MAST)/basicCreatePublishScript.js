
import { Address, Script, Signer, Tap, Tx } from '@cmdcode/tapscript'
import { SecretKey } from '@cmdcode/crypto-utils'
import { Buff }      from '@cmdcode/buff-utils'
import fs      from 'fs/promises'

// The 'marker' bytes. Part of the ordinal inscription format.
const marker   = Buff.encode('ord')
/* Specify the media type of the file. Applications use this when rendering 
  * content. See: https://developer.mozilla.org/en-US/docs/Glossary/MIME_type 
  */
const mimetype = Buff.encode('image/png')

const imgpath = new URL('C:/Users/arad4228/Desktop/tapscript/test/example/taproot/image.png', import.meta.url).pathname
const imgdata = await fs.readFile(imgpath).then(e => new Uint8Array(e))

// Create a keypair to use for testing.
const secret = '0a7d01d1c2e1592a02ea7671bb79ecd31d8d5e660b008f4b10e67787f4f24712'
const seckey = new SecretKey(secret, { type: 'taproot' })
const pubkey = seckey.pub
console.log("SecretKey: %s", seckey)
console.log("PublicKey: %s", pubkey)

// Basic format of an 'inscription' script.
const script  = [ pubkey, 'OP_CHECKSIG', 'OP_0', 'OP_IF', marker, '01', mimetype, 'OP_0', imgdata, 'OP_ENDIF' ]
console.log("Script: %s", JSON.stringify(script))

// For tapscript spends, we need to convert this script into a 'tapleaf'.
const tapleaf = Tap.encodeScript(script)
console.log("TapLeaf: %s", tapleaf)

// Generate a tapkey that includes our leaf script. Also, create a merlke proof 
// (cblock) that targets our leaf and proves its inclusion in the tapkey.
const [ tpubkey, cblock ] = Tap.getPubKey(pubkey, { target: tapleaf })
console.log("tPubKey: %s", tpubkey)
console.log("CBlock: %s", cblock)

// A taproot address is simply the tweaked public key, encoded in bech32 format.
const address = Address.p2tr.fromPubKey(tpubkey, 'testnet')
console.log("Address: %s", address)
/* NOTE: To continue with this example, send 100_000 sats to the above address.
 * You will also need to make a note of the txid and vout of that transaction,
 * so that you can include that information below in the redeem tx.
 */ 

const txdata = Tx.create({
  vin  : [{
    // Use the txid of the funding transaction used to send the sats.
    txid: 'b8ed81aca92cd85458966de90bc0ab03409a321758c09e46090988b783459a4d',
    // Specify the index value of the output that you are going to spend from.
    vout: 0,
    // Also include the value and script of that ouput.
    prevout: {
      // Feel free to change this if you sent a different amount.
      value: 100_000,
      // This is what our address looks like in script form.
      scriptPubKey: [ 'OP_1', tpubkey ]
    },
  }],
  vout : [{
    // We are leaving behind 1000 sats as a fee to the miners.
    value: 99_000,
    // This is the new script that we are locking our funds to.
    scriptPubKey: Address.toScriptPubKey('bcrt1q6zpf4gefu4ckuud3pjch563nm7x27u4ruahz3y')
  }]
})
console.log("Init TxData: %s", JSON.stringify(txdata))

// For this example, we are signing for input 0 of our transaction,
// using the untweaked secret key. We are also extending the signature 
// to include a commitment to the tapleaf script that we wish to use.
const sig = Signer.taproot.sign(seckey, txdata, 0, { extension: tapleaf })
console.log("Signature: %s", sig)

// Add the signature to our witness data for input 0, along with the script
// and merkle proof (cblock) for the script.
txdata.vin[0].witness = [ sig, script, cblock ]
console.log("Inserted TxData: %s", JSON.stringify(txdata))

// Check if the signature is valid for the provided public key, and that the
// transaction is also valid (the merkle proof will be validated as well).
const isValid = await Signer.taproot.verify(txdata, 0, { pubkey, throws: true })
console.log("IsValid: %s", isValid)
// You can publish your transaction data using 'sendrawtransaction' in Bitcoin Core, or you 
// can use an external API (such as https://mempool.space/docs/api/rest#post-transaction).