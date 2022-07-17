
const nats = require("nats")
// to create a connection to a nats-server:
async function pubNats(value)
{
const nc = await nats.connect({ servers: process.env.NATS_URL });

// create a codec
const sc = nats.StringCodec();
// create a simple subscriber and iterate over messages
// matching the subscription
const sub = nc.subscribe("test");
(async () => {
  for await (const m of sub) {
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
  }
  console.log("subscription closed");
})();

    nc.publish("test", sc.encode(value));


// we want to insure that messages that are in flight
// get processed, so we are going to drain the
// connection. Drain is the same as close, but makes
// sure that all messages in flight get seen
// by the iterator. After calling drain on the connection
// the connection closes.
await nc.drain();
}

module.exports = {pubNats};