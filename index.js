// Import required modules and packages
import { createLightNode, waitForRemotePeer } from "@waku/sdk";
import { multiaddr as MultiformatsMultiaddr } from "@multiformats/multiaddr";

async function main() {
  console.log("Creating Waku node.");
  const node = await createLightNode();

  console.log("Starting Waku node.");
  await node.start();
  console.log("Waku node started.");
  console.log("Local Peer ID:", node.libp2p.peerId.toString());

  const ma = "/dns4/waku-2.mainnet.bootnodes.graphcast.xyz/tcp/8000/wss";
  console.log("Dialing peer:", ma);
  const multiaddr = MultiformatsMultiaddr(ma);
  await node.dial(multiaddr, ["filter", "lightpush"]);
  await waitForRemotePeer(node, ["filter", "lightpush"]);
  const peers = await node.libp2p.peerStore.all();

  if (peers.length > 0) {
    console.log("Peer dialed successfully:", peers[0].id.toString());
  } else {
    console.log("Failed to dial peer.");
  }

  // Close the node after operations
  await node.stop();
}

main().catch((error) => {
  console.error("Error:", error);
});
