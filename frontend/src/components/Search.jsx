import React, { useEffect, useState } from "react";
import MasonryLayout from './MasonryLayput'
import { client } from "../client";
import {feedQuery, searchQuery} from '../utils/data.js'
import Spinner from './Spinner'

const Search = ({searchTerm}) => {
  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(false)

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9\s]/g, '');
  };

  const cleanInput = (input) => {
    return input.trim(); // Trim leading and trailing white spaces
  };
  let cleanSearchTerm = '';
  useEffect(() => {
    const sanitizedSearchTerm = sanitizeInput(searchTerm);
    cleanSearchTerm = cleanInput(sanitizedSearchTerm)

    if(cleanSearchTerm !== ''){
      setLoading(true)

      const query = searchQuery(cleanSearchTerm.toLowerCase());

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
    {pins?.length === 0 &&  !loading && (
      <div className="mt-10 text-center text-xl">No Pins Found!</div>
    )}
  </div>;
};

export default Search;
