from pathlib import Path
from shutil import copy2

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen.canvas import Canvas

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PDF = ROOT / "output/pdf/demoforge-requirements-example.pdf"
PUBLIC_PDF = ROOT / "public/examples/demoforge-requirements-example.pdf"


def main():
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_PDF.parent.mkdir(parents=True, exist_ok=True)

    canvas = Canvas(str(OUTPUT_PDF), pagesize=A4)
    canvas.setTitle("DemoForge 기능명세서 예시")
    canvas.setAuthor("DemoForge")
    canvas.setSubject("기능명세서 양식 준비 전 빈 PDF")
    canvas.showPage()
    canvas.save()

    copy2(OUTPUT_PDF, PUBLIC_PDF)
    print(OUTPUT_PDF)
    print(PUBLIC_PDF)


if __name__ == "__main__":
    main()
