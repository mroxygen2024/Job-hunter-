import fs from "fs";
import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function base64ToPDFDocs(base64, filename) {
  const buffer = Buffer.from(base64, "base64");
  const tempPath = path.join(process.cwd(), `tmp-${Date.now()}-${filename}`);

  fs.writeFileSync(tempPath, buffer);

  const loader = new PDFLoader(tempPath);
  const docs = await loader.load();

  fs.unlinkSync(tempPath);
  return docs;
}
