import React, { useState } from 'react'
import * as NeoVis from 'neovis.js'
import {
    useJsonToCsv
} from 'react-json-csv'

import './graph.css'

import { Button, CircularProgress, TextField, TextareaAutosize } from '@material-ui/core'

const CompletionEvent = 'completed'

function CASC() {
    const { saveAsCsv } = useJsonToCsv()

    const [loading, setLoading] = useState(false)
    const [nodesLimit, setNodesLimit] = useState(10)
    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])
    const [initial_cypher, setQuery] = useState('MATCH (n)-[r]->(m) RETURN n, r, m')

    const downLoadGraph = () => {
        let filename = 'Csv-file-nodes'
        // const fields = Object.keys(nodes[0])
        let fields = {
            "id": "Index",
            "value": "Value",
            "raw": "Raw",
            "title": "Title",
        }
        // save edges to csv
        let data = []
        console.log(fields)
        for (const [key, value] of Object.entries(nodes)) {
            data = [...data, value]
        }

        saveAsCsv({ data, fields, filename })

        console.log('nodes saved')

        filename = 'Csv-file-edges'
        data = []
        console.log(edges)
        fields = {
                "id": "Index",
                "value": "Value",
                "raw": "Raw",
                "from": "From",
                "to": "To",
                "label": "Label"
            }
        console.log(fields)
        for (const [key, value] of Object.entries(edges)) {
            data = [...data, value]
        }

        console.log(data)
        console.log('typeof data: ', typeof data)
        saveAsCsv({ data, fields, filename })

        console.log('edges saved')
    }
    const handleLoadGraph = () => {
        document.getElementById('graph-container-casc').innerHTML = '';
        setLoading(true);

        const config = {
            container_id: "graph-container-casc",
            server_url: process.env.REACT_APP_NEO4J_URL_CASC,
            server_user: process.env.REACT_APP_NEO4J_USER,
            server_password: process.env.REACT_APP_NEO4J_PASSWORD_CASC,
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
            initial_cypher: `${initial_cypher} LIMIT ${nodesLimit}`,
            console_debug: true,
            encrypted: "ENCRYPTION_ON",
            trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"

        }

        const graphContainer = new NeoVis.default(config)
        graphContainer.registerOnEvent(CompletionEvent, () => {
            setLoading(false)
            setNodes(graphContainer._nodes)
            setEdges(graphContainer._edges)
        });
        graphContainer.render()
    };

    return (
        <>
            <aside className="button-bar">
                <p><TextareaAutosize onChange={e => {setQuery(e.target.value)}} aria-label="empty textarea" placeholder="Type cypher query here" /></p>
                <Button variant="contained" onClick={handleLoadGraph}>Load graph (limit {nodesLimit})</Button>
                <TextField
                    id="nodes-limit"
                    label="Nodes limit"
                    variant="outlined"
                    type="number"
                    value={nodesLimit}
                    onInput={e => setNodesLimit(e.target.value)}
                />
                <Button variant="contained" onClick={downLoadGraph}>download in csv</Button>
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