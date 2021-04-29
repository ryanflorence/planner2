import ReactDOM from "react-dom";
import { RemixBrowser } from "remix";

// @ts-expect-error @types/react-dom is broken
ReactDOM.hydrate(<RemixBrowser />, document);
