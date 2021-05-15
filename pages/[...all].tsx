import { useRouter } from 'next/router'
import React from 'react'
import {
    Parser
} from '../utils/convert'
import axios from 'axios'


export default function Docs() {

    const router = useRouter()
    let [files, setFiles] = React.useState([])
    let [loading, setLoading] = React.useState(true)

    let [md, setMd] = React.useState(``)


    React.useEffect(() => {
        if (router.asPath !== router.route) {
            let q = router.query;



            let path = q.all;

            axios.get(`http://localhost:3000/markdown/${path}.md`).then(({ data }) => {
                setMd(data)
                axios.get(`http://localhost:3000/api/files`).then(({ data }) => {
                    setFiles(data.sort((a, b) => {
                        let typeA = a.type.toLowerCase();
                        let typeB = b.type.toLowerCase();

                        return typeA === typeB ? 0 : typeA < typeB ? -1 : 1

                    }).reverse())
                    setLoading(false);
                })
            })

        }
    }, [router])

    function firstUpperCase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function ChangeDocument(evt) {
        let t = evt.target.ariaLabel;

        axios.get(`http://localhost:3000/markdown/${t}.md`).then(({ data }) => {
            setMd(data)
        })

    }


    let render = Parser(md)

    return (
        !loading && (
            <div id="doc-host">

                <div id="sidebar">

                    <br />
                    <br />
                    {
                        files.map(f => {

                            if (f.type === 'dir') return (

                                <div>

                                    <h5> {f.dirname.replace('_', ' ').toUpperCase()} </h5>
                                    {
                                        f.files.map(t => {

                                            return (
                                                <p onClick={ChangeDocument} aria-label={f.dirname + '/' + t} style={{ cursor: 'pointer' }} className="doc-item-folder">
                                                    {
                                                        firstUpperCase(t)
                                                    }
                                                </p>
                                            )

                                        })
                                    }

                                    
                                </div>

                                

                            )

                            return (
                                <p onClick={ChangeDocument} aria-label={f.data} style={{ cursor: 'pointer' }}>
                                    {
                                        firstUpperCase(f.data)
                                    }
                                </p>
                            )
                        })
                    }
                </div>


                <div id="doc-content" dangerouslySetInnerHTML={{ __html: render }} />


            </div>
        )
    )
}