import React, { useState } from 'react'
import * as NeoVis from 'neovis.js'
import {
    useJsonToCsv
} from 'react-json-csv'
import './graph.css'
import { Button, CircularProgress, TextField, TextareaAutosize } from '@material-ui/core'

const CompletionEvent = 'completed'

function BGI() {
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
            console.log(key)
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
            console.log(key)
        }

        console.log(data)
        console.log('typeof data: ', typeof data)
        saveAsCsv({ data, fields, filename })

        console.log('edges saved')
    }
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
            setNodes(graphContainer._nodes)
            setEdges(graphContainer._edges)
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
                <Button variant="contained" onClick={downLoadGraph}>download in csv</Button>
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