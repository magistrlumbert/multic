import React, { useState } from 'react';

import * as NeoVis from 'neovis.js';

import './graph.css';

import { Button, CircularProgress, TextField } from '@material-ui/core';

const CompletionEvent = 'completed';

function CASC() {

    const [loading, setLoading] = useState(false);
    const [nodesLimit, setNodesLimit] = useState(10);

    const handleLoadGraph = () => {
        document.getElementById('graph-container-casc').innerHTML = '';
        setLoading(true);

        const config = {
            container_id: "graph-container-casc",
            server_url: "bolt://34.239.140.111",
            server_user: "neo4j",
            server_password: "i-0cd55b5744e56cfcc",
            labels: {
                "Character": {
                    "caption": "name",
                    "size": "pagerank",
                    "community": "community"
                }
            },
            relationships: {
                "FILED": {
                    "thickness": "weight",
                    "caption": false
                }
            },
            initial_cypher: `MATCH (n)-[r:FILED]->(m) RETURN n,r,m LIMIT ${nodesLimit}`,
            console_debug: true,
            encrypted: "ENCRYPTION_ON",
            trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"

        };

        const graphContainer = new NeoVis.default(config);
        graphContainer.registerOnEvent(CompletionEvent, () => {
            setLoading(false);
        });
        graphContainer.render();
    };

    return (
        <>
            <aside className="button-bar">
                <Button variant="contained" onClick={handleLoadGraph}>Load graph (limit {nodesLimit})</Button>
                <TextField
                    id="nodes-limit"
                    label="Nodes limit"
                    variant="outlined"
                    type="number"
                    value={nodesLimit}
                    onInput={e => setNodesLimit(e.target.value)}
                />
            </aside>
            <div className="graph-and-loading-icon-wrapper">
                <div className="loading-icon-wrapper">
                    {loading && <CircularProgress size={100} />}
                </div>
                <div id="graph-container-casc"></div>
            </div>
        </>
    );
}

export default CASC