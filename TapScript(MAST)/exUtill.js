
import { Address, Script, Signer, Tap, Tx } from '@cmdcode/tapscript'


const cblock = 'c1187791b6f712a8ea41c8ecdd0ee77fab3e85263b37e1ec18a3651926b3a6cf27'
const { intkey, parity, paths, version } = Tap.util.readCtrlBlock(cblock)
console.log("IntKey: %s", JSON.stringify(intkey))
console.log("Parity: %s", parity)
console.log("Paths: %s",  paths)
console.log("Version: %s", version)
// Expected output, with key formatted as hex instead of bytes (for readability).
// {
//   intkey: '187791b6f712a8ea41c8ecdd0ee77fab3e85263b37e1ec18a3651926b3a6cf27',
//   parity: 3,
//   paths: [],
//   version: 192
// }