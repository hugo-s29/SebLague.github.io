import { requestData } from "../load";
import { materialColors } from "../colors";

window.current_page_id = "repositories";
window.ghColorsEnd = materialColors.blue;

requestData({
  getrepos: true,
});
