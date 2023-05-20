import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../client";
import MasonryLayput from "./MasonryLayput";
import Spinner from "./Spinner";
import { feedQuery, searchQuery } from "../utils/data";

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();
  const [pins, setPins] = useState(null);

  useEffect(() => {
    setLoading(true);

    if (categoryId) {
      const query = searchQuery(categoryId);

      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) return <Spinner message="Adding new ideas to your feed!" />;
  return <div>{pins && <MasonryLayput pins={pins} />}</div>;
};

export default Feed;
