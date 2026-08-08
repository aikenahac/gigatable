import { createFromSource } from "fumadocs-core/search/server";
import { docsSource } from "../docs/source";

const search = createFromSource(docsSource);

export function loader() {
  return search.staticGET();
}
