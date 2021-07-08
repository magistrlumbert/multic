import React, { useState } from 'react';

import * as NeoVis from 'neovis.js';

import './graph.css';

import { Button, CircularProgress, TextField } from '@material-ui/core';

const CompletionEvent = 'completed';

function BGI() {

    const [loading, setLoading] = useState(false);
    const [nodesLimit, setNodesLimit] = useState(10);

    const handleLoadGraph = () => {
        document.getElementById('graph-container-casic').innerHTML = '';
        setLoading(true);

        const config = {
            container_id: "graph-container-casic",
            server_url: "bolt://3.208.1.4:7687",
            server_user: "neo4j",
            server_password: "i-0e331822501bc6d84",
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
            encrypted: "ENCRYPTION_ON",

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
                <div id="graph-container-casic"></div>
            </div>
        </>
    );
}

export default BGI