# ipfs-limit

This repo contains experimental code. It retrieves the list of peers in the ResourceMgr.Allowlist and applies a 'whitelist'
set of limits to those peers. All other swarm peers, it applies 'blacklist' limits to. The goal is to reduce the amount
of resources used for non-ipfs-coord peers.

However, in my tests, I did not see a significant reduction in bandwidth usage.

