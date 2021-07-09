import React, { useState } from 'react'

import * as NeoVis from 'neovis.js'

import './graph.css'

import { Button, CircularProgress, TextField, TextareaAutosize } from '@material-ui/core'

const CompletionEvent = 'completed'

function BGI() {

    const [loading, setLoading] = useState(false)
    const [nodesLimit, setNodesLimit] = useState(10)
    const [initial_cypher, setQuery] = useState('MATCH (n)-[r]->(m) RETURN n, r, m')

    const handleLoadGraph = () => {
        document.getElementById('graph-container').innerHTML = ''
        setLoading(true)
        const config = {
            server_url: process.env.REACT_APP_NEO4J_URL_BGI,
            server_user: process.env.REACT_APP_NEO4J_USER,
            server_password: process.env.REACT_APP_NEO4J_PASSWORD_BGI,
            container_id: "graph-container",
            labels: {
                "Patent": {
                    "caption": "patentID",
                    "size": "pagerank",
                    "community": "community"
                },
                "Organization": {
                    "caption": "orgID",
                    "size": "pagerank",
                    "community": "community"
                },

            },
            relationships: {
                "FILED": {
                    "thickness": "weight",
                    "caption": false
                },

            },
            initial_cypher: `${initial_cypher} LIMIT ${nodesLimit}`,
            console_debug: true,
            encrypted: "ENCRYPTION_ON",
            trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"
        }
        let graphContainer = null
        try {
            graphContainer = new NeoVis.default(config) // может выбрасывать три вида исключений
        } catch (e) {
            console.log(e.message)
            if (e instanceof TypeError) {
                // обработка исключения TypeError
            } else if (e instanceof RangeError) {
                // обработка исключения RangeError
            } else if (e instanceof EvalError) {
                // обработка исключения EvalError
            } else {
                // обработка остальных исключений
                console.log("exception"); // передать обработчику ошибок
            }
        }

        graphContainer.registerOnEvent(CompletionEvent, () => {
            setLoading(false)
        })
        graphContainer.render()
    }

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
                    onInput={e => {setNodesLimit(e.target.value)}}
                />
            </aside>
            <div className="graph-and-loading-icon-wrapper">
                <div className="loading-icon-wrapper">
                    {loading && <CircularProgress size={100} />}
                </div>
                <div id="graph-container"></div>
            </div>
        </>
    );
}

export default BGI