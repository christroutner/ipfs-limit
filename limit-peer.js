/*
  Test to see if a second node.js app can limit a peer.
*/

const shell = require('shelljs')

const IPFS_ID = '12D3KooWGE9AiAeEn8aviAHSpcNRLtHam5XZi26ujJc3ugKKmsfk'

async function start() {
  try {
    // Get a list of peers in the Allowlist.
    const cmd0 = `ipfs config Swarm.ResourceMgr.Allowlist`
    const result0 = shell.exec(cmd0)
    const whitelistPeers = JSON.parse(result0.toString())
    console.log('whitelistPeers: ', whitelistPeers)

    // Get all the swarm peers.
    const cmd1 = `ipfs swarm peers`
    const result1 = shell.exec(cmd1)
    const swarmPeers = result1.toString().split("\n")
    console.log('swarmPeers: ', swarmPeers)

    // Separate the swarm peers into an array of IPFS IDs
    const peers = []
    for(let i=0; i < swarmPeers.length; i++) {
      const thisPeer = swarmPeers[i]

      const peerId0 = thisPeer.split('/p2p/')
      // console.log('peerId: ', peerId)

      try {
        const peerId1 = peerId0[1].split('/p2p-circuit')
        // console.log('peerId1: ', peerId1)

        peers.push(peerId1[0])
      } catch(err) {
        peers.push(peerId0[1])
      }
    }
    console.log('peers: ', peers)


    // Loop through all the peers
    for(let i=0; i < peers.length; i++) {
      const thisPeer = peers[i]

      if(!thisPeer) continue

      // Check if this peer is in the Allowlist
      const peerIsAllowed = whitelistPeers.filter(x => x === thisPeer)
      if(peerIsAllowed.length) {
        // Add the whitelist filter to the peer.
        const cmd = `ipfs swarm limit peer:${thisPeer} ../limit-whitelist.json`
        console.log('executing cmd: ', cmd)
        shell.exec(cmd)
      } else {
        // Add the blacklist filter to the peer.
        const cmd = `ipfs swarm limit peer:${thisPeer} ../limit-blacklist.json`
        console.log('executing cmd: ', cmd)
        shell.exec(cmd)
      }
    }

    console.log('Done!')
  } catch(err) {
    console.error('Error: ', err)
  }
}
start()
