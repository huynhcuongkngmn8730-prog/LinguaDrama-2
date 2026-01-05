import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { GeneratedScript } from '../types';

export const readDocxFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          reject(new Error("Failed to read file"));
          return;
        }
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

export const createScriptDocx = async (script: GeneratedScript): Promise<Blob> => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: `German Audio Drama: ${script.topic}`,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        ...script.lines.flatMap(line => [
          new Paragraph({
            children: [
              new TextRun({
                text: `${line.speaker}`,
                bold: true,
                size: 24, // 12pt
                color: line.speaker === 'Lukas' ? "2E7D32" : "1565C0", // Green for Lukas, Blue for Felix
              }),
              new TextRun({
                text: line.stageDirection ? ` [${line.stageDirection}]` : "",
                italics: true,
                size: 20,
                color: "666666",
              }),
            ],
            spacing: { before: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: line.german,
                size: 24,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `(${line.english})`,
                size: 20,
                italics: true,
                color: "555555"
              }),
            ],
            spacing: { after: 300 }, // Space between dialogue blocks
          }),
        ]),
      ],
    }],
  });

  return await Packer.toBlob(doc);
};
