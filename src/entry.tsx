import { Detail, environment} from "@raycast/api"
// ![](file://${environment.assetsPath}/command-icon.png)
export default function() {
  return <Detail
    // command-icon.png
    markdown={`<img src="file://${environment.assetsPath}/command-icon.png" width="50" style="width: 50px">`} />
}