import React, {useEffect,useState} from 'react'

function App() {

  const [backendData,setBackendData] = useState([{}])

  useEffect(() => {
    fetch('/graphql').then(
      res => res.json()
    ).then(
      data => setBackendData(data)
    )
  },[])
  return (
    <div>data</div>
  )
}

export default App