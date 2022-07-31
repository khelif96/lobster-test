import {useState, useEffect} from "react";
import axios from "axios";
import { useAppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
const tempS3N2Million = "https://s3.us-east-1.amazonaws.com/john.liu/logs_n2million.txt?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQCOuoC9Jl9Nh6%2FxJML%2BCPm4HaCW%2B23Rs%2FshTYR%2Ftd36LQIhAK6X115NgEzz%2BBSMSl7BexHzdGVuSwj5M3%2FnwwQ5YA%2FPKqEECDsQABoMNTU3ODIxMTI0Nzg0Igxi0rzlVI3d%2Fo%2BDlZIq%2FgOINoEQA7UhzXf%2FC3QE4gYonT2%2BjoEodmHztyXdtUrrUC%2Bj2e%2FESwdtTeGWMVmO1xKYD4T3%2FPOIDEGSQ5fe6yimsUn0Wg6VgM63rYlHP%2B0r4C005JUNB8zsJkuMairxlgwp4OQYjl%2FPzDUXGT1pIJ14gbCh%2FTScVteS4LlhxJhOTrXdgn5mEr62xt3Hjo1e1Exak7Yc0shUll6%2Fr9M7jhllwUu05Fw26b%2F6SlS%2BU%2BhPA9R%2BTeE0PyKGIUzWnN3hDDA2NAJ%2Fsh0mE2VtRLL0wCZD%2F2pjFcjQymTUxtIh28HRkVRtC86GmMWsUqGCcRYAahHQtr%2FcyZ3%2BV3NUo5bTe%2Ftjc6gGJJ3pmGCPxA9cQGRhBMjrrlF5dK48BdKGXBiZ8%2B9RZ%2F63q9vEbFqu%2BMQdSARaZTNUJZvaBQpe6k0HYlST0xo6a3sZKW6qwQhSw7UTLckWTTEC%2Bv6lUvQhqQ6ORHgGOXxUih%2BbSPWoC4cbWhzmGpgdM9fZIY7DHTboX0nVlvBU7t4uOpDmONykz1f7dTKBwJCtaiQiGGHNW5qhYhBcj%2FmWQqXTMUO%2FuXNKLC1EvQHLYDceK3CxKIVouK0g7JOZi7xSBvoS7NBXzdFTdjibKjicuRetNruvRanICeGReTbAOzQnLbqDsQeeQ0HwJhcm37dOjR7XNtiA1iXHyOown7qXlwY6kwKSRxgVym1EKWsr5gwgGzU6ER26GigbawygXMBAIICsUiFxpDmDjn8dU5Syh3BZWDx4YFqbsYXTFgW9ojA30gWtDSsMCKSrPaF7TVOKxjJ3GJd1rhDBd65GMSISfvPWJn1I2heWliWDWHR1PK8Zwvvqg1H%2BpBRv1favxKPt4VDnApJ9XgtLMCJE6j8W2IYOagcSSAkoW0ktLhFZ07gJ4FjaCqMbXq2cGZiTD6%2B0Z8sulks%2BLKIrTGDLTMG2NRkbeByjXyDPdM0ucE8y593nbJYhXzZdoXBnVD7O6OZNwZRZ2W132OiKZujW9MwIbniDg4jVlVlrnb6UjgBfPnRoKgJ4Q4v8iwLmfovFKSv0dV1aUBNFdA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220731T013910Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIAYDYF24CYIK4UIML7%2F20220731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d6b5616727516d0dc14a8dcdc3ff1af04b7ffba3656df4508f51fe42d1ae851a";

const Loader = () => {
      const [downloadProgress, setDownloadProgress] = useState(0);
    const { setLogs } = useAppContext();
    const navigate = useNavigate();
      useEffect(() => {
     axios.get(tempS3N2Million, {
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setDownloadProgress(percentCompleted);
      },
      responseType: "text"
    }).then(response => {
        setLogs(response.data.split("\n"));
        navigate("/logs");
    })


 
  }, []);

  return (
    <div className="Loader">
               {downloadProgress > 0 && downloadProgress < 100 && (
         <i>Downloading: {downloadProgress} %</i> 
        )}

    </div>
  )
}

export default Loader;