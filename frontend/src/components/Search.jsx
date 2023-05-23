import React, { useEffect, useState } from "react";
import MasonryLayout from './MasonryLayput'
import { client } from "../client";
import {feedQuery, searchQuery} from '../utils/data.js'
import Spinner from './Spinner'

const Search = ({searchTerm}) => {
  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(searchTerm !== ''){
      setLoading(true)

      const query = searchQuery(searchTerm.toLowerCase())

      client.fetch(query)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    }else{
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    }
  }, [searchTerm])
  
  return <div>
    {loading && <Spinner message="Searching Pins..." />}
    {pins?.length !== 0 && <MasonryLayout pins={pins}/>}
    {pins?.length === 0 && searchTerm !== '' && !loading && (
      <div className="mt-10 text-center text-xl">No Pins Found!</div>
    )}
  </div>;
};

export default Search;
