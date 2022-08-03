import React, {useState, useEffect} from "react";
import axios from "axios";
import { useAppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";




const Loader = () => {
    const [downloadProgress, setDownloadProgress] = useState(0);
    const { setLogs } = useAppContext();
    const navigate = useNavigate();
    useEffect(() => {
        // testPaginatedLogs(setDownloadProgress, setLogs, logs, navigate)
        testSingleLogDownload(setDownloadProgress, setLogs, navigate)
    }, []);
    
    return (
        <div className="Loader">
               {downloadProgress > 0 && downloadProgress < 100 && (
                   <i>Downloading: {downloadProgress} %</i> 
                   )}

    </div>
  )
}


// This represents a path to a large log file that was split into 100k line chunks
const logs_array = ["logs_naa", "logs_nab", "logs_nac", "logs_nad", "logs_nae", "logs_naf",
 "logs_nag", "logs_nah", "logs_nai", "logs_naj", "logs_nak", "logs_nal", "logs_nam", "logs_nan",
  "logs_nao", "logs_nap", "logs_naq", "logs_nar", "logs_nas", "logs_nat", "logs_nau", "logs_nav",
   "logs_naw", "logs_nax", "logs_nay", "logs_naz", "logs_nba", "logs_nbb", "logs_nbc", "logs_nbd",
    "logs_nbe", "logs_nbf", "logs_nbg", "logs_nbh", "logs_nbi", "logs_nbj", "logs_nbk", "logs_nbl",
     "logs_nbm", "logs_nbn", "logs_nbo", "logs_nbp", "logs_nbq", "logs_nbr", "logs_nbs", "logs_nbt",
      "logs_nbu", "logs_nbv", "logs_nbw", "logs_nbx", "logs_nby", "logs_nbz"]


// POC for ingesting paginated logs this will allows us to load larger log files 
const testPaginatedLogs = (setDownloadProgress: (percent: number) => void, setLogs: (logs: string[]) => void, logs: string[], navigate : (path: string) => void) => {
 axios.all(logs_array.map(log =>  axios.get(`http://localhost:3000/${log}`, {
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setDownloadProgress(percentCompleted);
      },
      responseType: "text"
    }))).then(axios.spread((...responses) => {
        responses.forEach((response, i) => {
            logs.push(...response.data.split("\n"))
        })
        setLogs(logs)
        navigate("/logs");
    })
    ).catch(error => {
        console.log(error);
    }
    );
}

const testSingleLogDownload = (setDownloadProgress: (percent: number) => void, setLogs: (logs: string[]) => void, navigate : (path: string) => void) => {
    // Random logkeeper log
    axios.get(`https://logkeeper.mongodb.org/build/f65bd46cbd26f244ba97965e36d0ace9/test/62ea3bdf9041307bcb7b98d9?raw=1`, {
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setDownloadProgress(percentCompleted);
      },
      responseType: "text"
    }).then(response => {
        let logs = response.data.split("\n")
        // If this is a resmoke log lets apply some processing to it to transform it into a human readable log
        // logs = logs.map(line ==> applySomeProcessingFunction(line))
        setLogs(logs)
        // After logs have been saved to the context lets navigate to the logs page and render it to the user
        navigate("/logs");
    })
}

export default Loader;