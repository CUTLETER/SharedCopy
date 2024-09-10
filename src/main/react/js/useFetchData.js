import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetchData(url) {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(url);
                console.log(data);
                setData(data);
            } catch (err) {
                setError(err);
            }
        };
        fetchData();
    }, []);

    return { data: data, error };
}

export default useFetchData;
