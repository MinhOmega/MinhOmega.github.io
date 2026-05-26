import { readFileSync } from "node:fs";
import path from "node:path";
import { parseCVLatex } from "@/lib/cv-latex";
import { CVDocumentView } from "@/components/cv/cv-document";
import { DownloadResumeButton } from "@/components/cv/download-resume-button";

const CV_TEX_PATH = path.join(process.cwd(), "content", "cv", "minh_vo.tex");
const CV_PDF_HREF = "/files/minh_vo.pdf";
const CV_PDF_FILENAME = "Vo-Ngoc-Quang-Minh-Resume.pdf";

export default function CVPage() {
  const src = readFileSync(CV_TEX_PATH, "utf8");
  const doc = parseCVLatex(src);

  return (
    <>
      <CVDocumentView doc={doc} />
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <DownloadResumeButton href={CV_PDF_HREF} filename={CV_PDF_FILENAME} />
      </div>
    </>
  );
}
