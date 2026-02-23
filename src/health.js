const express = require("express");

function startHealthServer(shardId, port) {
    const app = express();

    app.get("/health", (req, res) => {
        res.json({
            status: "ok",
            shard: shardId,
            uptime: process.uptime()
        });
    });

    app.listen(port, () => {
        console.log(`Shard ${shardId} health server started on port ${port}`);
    });
}

module.exports = { startHealthServer };